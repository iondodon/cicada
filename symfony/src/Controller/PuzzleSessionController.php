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
        foreach($account->getPuzzleSessions() as $sess) {
            if($sess->getPuzzle()->getId() === (int)$puzzleId) {
                $sessions = $account->getPuzzleSessions();
                $sessions->removeElement($sess);
                $account->setPuzzleSessions($sessions);
                $em->remove($sess);
                $em->persist($account);
                $em->flush();
                return new JsonResponse(null, 200);
            }
        }

        return new JsonResponse(['message' => 'No session found.'], 400);
    }

    private function extractUnnecessaryStages($session) {
        /** @var Stage $stage */
        /** @var PuzzleSession  $session */
        /** @var Collection $stages */

        $stages = $session->getPuzzle()->getStages();
        foreach ($stages as $stage) {
            if($stage->getLevel() > $session->getCompleteness()) {
                $stages->removeElement($stage);
            }
        }
        $session->getPuzzle()->setStages($stages);

        return $session;
    }

    /**
     * @Route("/api/puzzle/get-sessions/{puzzleId}", name="puzzle_sessions.get-sessions", methods={"GET"})
     * @param $puzzleId
     * @return JsonResponse
     */
    public function getSession($puzzleId): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $sessions = new ArrayCollection();

        /** @var Team $team */
        foreach ($account->getTeamsMemberOf() as $team) {
            foreach ($team->getPuzzleSessions() as $session) {
                if($session->getPuzzle()->getId() === (int)$puzzleId) {
                    $session = $this->extractUnnecessaryStages($session);
                    $sessions->add($session);
                }
            }
        }

        foreach ($account->getPuzzleSessions() as $session) {
            if($session->getPuzzle()->getId() === (int)$puzzleId) {
                $session = $this->extractUnnecessaryStages($session);
                $sessions->add($session);
            }
        }

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
            ]
        ]);

        return new JsonResponse(json_decode($sessionsJson, true), 200);
    }

    /**
     * @Route("/api/puzzle/enroll-single-player/{puzzleId}", name="puzzle_sessions.enroll-single-player", methods={"POST"})
     * @param $puzzleId
     * @return JsonResponse
     */
    public function enrollSinglePlayer($puzzleId): JsonResponse
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
     * @return JsonResponse
     */
    public function enrollTeam($puzzleId, $teamId): JsonResponse
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
            return new JsonResponse(['message' => 'contest not found.'], 400);
        }

        $account = $this->getUser()->getAccount();
        $enrolledPlayers = $contest->getEnrolledPlayers();
        if($enrolledPlayers->contains($account)) {
            return new JsonResponse(['message' => 'You are already registered for this contest.'], 400);
        }
        $enrolledPlayers->add($account);
        $contest->setEnrolledPlayers($enrolledPlayers);
        $em->persist($contest);

        return $this->enrollSinglePlayer($contest->getPuzzle()->getId());
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
            return new JsonResponse(['message' => 'contest not found.'], 400);
        }

        /** @var Team $team */
        $team = $em->getRepository(Team::class)->find($teamId);
        if(!$team) {
            return new JsonResponse(['message' => 'Team not found'], 400);
        }

        $enrolledTeams = $contest->getEnrolledTeams();
        if($enrolledTeams->contains($team)) {
            return new JsonResponse(['message' => 'This teams is already enrolled.'], 400);
        }
        $enrolledTeams->add($team);
        $contest->setEnrolledTeams($enrolledTeams);
        $em->persist($contest);

        return $this->enrollTeam($contest->getPuzzle()->getId(), $teamId);
    }

    /**
     * @Route("/api/single-player-leave-contest/{contestId}", name="puzzle_sessions.leave-contest", methods={"POST"})
     * @param $contestId
     * @return JsonResponse
     */
    public function singlePlayerLeaveContest($contestId): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->find($contestId);
        if(!$contest) {
            return new JsonResponse(['message' => 'Contest not found.'], 400);
        }

        $account = $this->getUser()->getAccount();

        $enrolledPlayers = $contest->getEnrolledPlayers();
        if(!$enrolledPlayers->contains($account)) {
            return new JsonResponse(['message' => 'Player not found among players enrolled for this contest.'], 400);
        }
        $enrolledPlayers->removeElement($account);
        $contest->setEnrolledPlayers($enrolledPlayers);
        $em->persist($contest);

        return $this->singlePlayerLeavePuzzle($contest->getPuzzle()->getId());
    }
}
