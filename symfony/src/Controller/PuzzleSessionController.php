<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Contest;
use App\Entity\Puzzle;
use App\Entity\PuzzleSession;
use App\Entity\Stage;
use App\Entity\Team;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class PuzzleSessionController extends AbstractFOSRestController
{
    /**
     * @Route("/api/single-player-leave-puzzle/{puzzleId}", name="puzzle_sessions.leave-puzzle", methods={"POST"})
     * @param $puzzleId
     * @return JsonResponse
     */
    public function singlePlayerLeavePuzzle($puzzleId): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->find($puzzleId);
        if(!$puzzle) {
            return new JsonResponse(['message' => 'Puzzle not found.'], 400);
        }

        /** @var Account $account */
        $account = $this->getUser()->getAccount();
        $sessions = $account->getPuzzleSessions();
        foreach($sessions as $sess) {
            if($sess->getPuzzle()->getId() === (int)$puzzleId) {
                $sessions->removeElement($sess);
                $account->setPuzzleSessions($sessions);
                $em->persist($account);
                $em->remove($sess);
                $em->flush();
                return new JsonResponse(null, 200);
            }
        }

        return new JsonResponse(['message' => 'No session found.'], 400);
    }

    /**
     * @Route("/api/remove-team-session/{sessionId}", name="puzzle_sessions.remove-team-session", methods={"DELETE"})
     * @param $sessionId
     * @return JsonResponse
     */
    public function removeTeamSession($sessionId): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $session = $em->getRepository(PuzzleSession::class)->find($sessionId);
        if(!$session) {
            return new JsonResponse(['message' => 'Session not found.'], 400);
        }

        $team = $session->getTeamPlayer();
        if(!$team) {
            return new JsonResponse(['message' => 'Team not found.'], 400);
        }

        /** @var Account $teamCreator */
        /** @var Team $team */
        $teamCreator = $team->getCreator();
        if(!$teamCreator) {
            return new JsonResponse(['message' => 'Team creator not found.'], 400);
        }

        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        if($teamCreator->getId() !== $account->getId()) {
            return new JsonResponse(['message' => 'You are not allowed to remove this team session.'], 400);
        }

        $em->remove($session);
        $em->flush();

        return new JsonResponse(null, 200);
    }

    /**
     * @Route("/api/puzzle/get-sessions/{puzzleId}", name="puzzle_sessions.get-sessions", methods={"GET"})
     * @param $puzzleId
     * @return JsonResponse
     */
    public function getSessions($puzzleId): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $sessions = new ArrayCollection();

        /** @var Team $team */
        foreach ($account->getTeamsMemberOf() as $team) {
            foreach ($team->getPuzzleSessions() as $sess) {
                if($sess->getPuzzle()->getId() === (int)$puzzleId) {
                    $sessions->add($sess);
                }
            }
        }

        foreach ($account->getPuzzleSessions() as $sess) {
            if($sess->getPuzzle()->getId() === (int)$puzzleId) {
                $sessions->add($sess);
            }
        }

        // TODO: to hide the unnecessary stages
//        /** @var PuzzleSession $sess */
//        /** @var Stage $stage */
//        foreach ($sessions as $sess) {
//            $puzzle = $sess->getPuzzle();
//            $filteredStages = new ArrayCollection();
//            foreach ($sess->getPuzzle()->getStages() as $stage) {
//                if($stage->getLevel() <= $sess->getCompleteness()) {
//                    $filteredStages->add($stage);
//                }
//            }
//            $puzzle->setStages($filteredStages);
//            $sess->setPuzzle($puzzle);
//        }

        if($sessions->isEmpty()) {
            return new JsonResponse(['message' => 'No session found.'], 400);
        }

        $sessionsJson = $serializer->serialize($sessions, 'json', [
            'attributes' => [
                'id',
                'singlePlayer' => [
                    'user' => ['fullName']
                ],
                'teamPlayer' => [
                    'id',
                    'name',
                    'members' => ['user' => ['id', 'fullName']],
                ],
                'completeness',
                'puzzle' => [
                    'stages' => [
                        'id',
                        'level',
                        'createdAt' => ['timestamp'],
                        'updatedAt' => ['timestamp'],
                        'description',
                    ],
                    'stagesCount',
                ],
                'contest' => ['id', 'name']
            ]
        ]);

        return new JsonResponse(json_decode($sessionsJson, true), 200);
    }

    /**
     * @Route("/api/puzzle/enroll-single-player/{puzzleId}", name="puzzle_sessions.enroll-single-player", methods={"POST"})
     * @param $puzzleId
     * @param $contestId
     * @return JsonResponse
     */
    public function enrollSinglePlayer($puzzleId, $contestId = null): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        foreach ($account->getPuzzleSessions() as $session) {
            if($session->getPuzzle()->getId() === (int)$puzzleId) {
                return new JsonResponse(['message' => 'Already enrolled'], 400);
            }
        }

        /** @var Puzzle $puzzle */
        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $puzzleId]);
        if(!$puzzle) {
            return new JsonResponse(['message' => 'Puzzle not found.'], 400);
        }

        $session = new PuzzleSession();
        if($contestId) {
            /** @var Contest $contest */
            $contest = $em->getRepository(Contest::class)->find($contestId);
            if(!$contest) {
                return new JsonResponse(['message' => 'Contest not found.'], 400);
            }

            $session->setContest($contest);
        }
        $session->setCompleteness(0);
        $session->setSinglePlayer($account);
        $session->setPuzzle($puzzle);
        $em->persist($session);

        $sessions = $account->getPuzzleSessions();
        $sessions->add($session);
        $account->setPuzzleSessions($sessions);
        $em->persist($account);

        $em->flush();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);
        $sessionJson = $serializer->serialize($session, 'json', [
            'attributes' => [
                'teamPlayer' => [
                    'name',
                    'members' => ['user' => ['fullName']],
                ],
                'completeness',
            ],
        ]);

        return new JsonResponse(json_decode($sessionJson, true), 200);
    }

    /**
     * @Route("/api/puzzle/enroll-team/{puzzleId}/{teamId}", name="puzzle_sessions.enroll-team", methods={"POST"})
     * @param $puzzleId
     * @param $teamId
     * @param $contestId
     * @return JsonResponse
     */
    public function enrollTeam($puzzleId, $teamId, $contestId = null): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        /** @var Team $team */
        $team = $em->getRepository(Team::class)->findOneBy(['id' => $teamId]);
        if(!$team){
            return new JsonResponse(['message' => 'No team found.'], 400);
        }

        /** @var Puzzle $puzzle */
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $puzzleId]);
        if(!$puzzle) {
            return new JsonResponse(['message' => 'No puzzle found.'], 400);
        }

        foreach ($team->getPuzzleSessions() as $sess) {
            if($sess->getPuzzle()->getId() === (int)$puzzleId) {
                return new JsonResponse(['message' => 'This team is already registered for this puzzle.'], 400);
            }
        }

        $session = new PuzzleSession();
        if($contestId) {
            /** @var Contest $contest */
            $contest = $em->getRepository(Contest::class)->find($contestId);
            if(!$contest) {
                return new JsonResponse(['message' => 'Contest not found.'], 400);
            }

            $session->setContest($contest);
        }
        $session->setPuzzle($puzzle);
        $session->setCompleteness(0);
        $session->setTeamPlayer($team);
        $em->persist($session);

        $sessions = $team->getPuzzleSessions();
        $sessions->add($session);
        $team->setPuzzleSessions($sessions);
        $em->persist($team);

        $em->flush();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);
        $sessionJson = $serializer->serialize($session, 'json', [
            'attributes' => [
                'teamPlayer' => [
                    'name',
                    'members' => [
                        'user' => ['fullName'],
                    ],
                ],
                'completeness',
            ],
        ]);

        return new JsonResponse(json_decode($sessionJson, true), 200);
    }

    /**
     * @Route("/api/contest/enroll-single-player/{contestId}", name="contests.enroll-single-player", methods={"POST"})
     * @param $contestId
     * @return JsonResponse
     */
    public function contestEnrollSinglePlayer(int $contestId): Response
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->find($contestId);
        if(!$contest) {
            return new JsonResponse(['message' => 'Contest not found.'], 400);
        }

        return $this->enrollSinglePlayer($contest->getPuzzle()->getId(), $contestId);
    }

    /**
     * @Route("/api/contest/enroll-team/{contestId}/{teamId}", name="contests.enroll-team", methods={"POST"})
     * @param $contestId
     * @param $teamId
     * @return JsonResponse
     */
    public function contestEnrollTeam(int $contestId, int $teamId): Response
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->find($contestId);
        if(!$contest) {
            return new JsonResponse(['message' => 'Contest not found.'], 400);
        }

        /** @var Team $team */
        $team = $em->getRepository(Team::class)->find($teamId);
        if(!$team) {
            return new JsonResponse(['message' => 'Team not found'], 400);
        }

        return $this->enrollTeam($contest->getPuzzle()->getId(), $teamId, $contestId);
    }
}
