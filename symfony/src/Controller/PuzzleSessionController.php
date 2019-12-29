<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Puzzle;
use App\Entity\PuzzleSession;
use App\Entity\Team;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class PuzzleSessionController extends AbstractFOSRestController
{
    /**
     * @Route("/api/puzzle_sessions", name="puzzle_sessions.index", methods={"GET"})
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return new JsonResponse();
    }

    /**
     * @Route("/api/get-session/{puzzleId}", name="puzzle_sessions.get-session", methods={"GET"})
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

        foreach ($account->getPuzzleSessions() as $session) {
            if($session->getPuzzle()->getId() === (int)$puzzleId) {
                $sessionJson = $serializer->serialize($session, 'json', [
                    'attributes' => [
                        'teamPlayer' => [
                            'name',
                            'members' => ['user' => ['id', 'fullName']],
                        ],
                        'completeness',
                    ],
                ]);

                return new JsonResponse(json_decode($sessionJson, true), 200);
            }
        }

        /** @var Team $team */
        foreach ($account->getTeamsMemberOf() as $team) {
            foreach ($team->getPuzzleSessions() as $session) {
                if($session->getPuzzle()->getId() === (int)$puzzleId) {
                    $sessionJson = $serializer->serialize($session, 'json', [
                        'attributes' => [
                            'teamPlayer' => [
                                'name',
                                'members' => ['user' => ['id', 'fullName']],
                            ],
                            'completeness',
                        ],
                    ]);

                    return new JsonResponse(json_decode($sessionJson, true), 200);
                }
            }
        }

        return new JsonResponse(['message' => 'No session found.'], 400);
    }

    /**
     * @Route("/api/enroll-single-player/{puzzleId}", name="puzzle_sessions.enroll-single-player", methods={"POST"})
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

        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $puzzleId]);

        $session = new PuzzleSession();
        $session->setCompleteness(0);
        $session->setSinglePlayer($account);
        if($puzzle) {
            /** @var Puzzle $puzzle */
            $session->setPuzzle($puzzle);
        } else {
                return new JsonResponse(['message' => 'Puzzle not found.'], 400);
        }

        $em->persist($session);

        $puzzles = $account->getPuzzlesEnrolledAt();
        $puzzles->add($puzzle);
        $account->setPuzzlesEnrolledAt($puzzles);

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
     * @Route("/api/enroll-team/{puzzleId}/{teamId}", name="puzzle_sessions.enroll-team", methods={"POST"})
     * @param $puzzleId
     * @param $teamId
     * @return JsonResponse
     */
    public function enrollTeam($puzzleId, $teamId): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $session = null;
        foreach ($account->getPuzzleSessions() as $sess) {
            if($sess->getPuzzle()->getId() === (int)$puzzleId) {
                $session = $sess;
                break;
            }
        }

        if(!$session) {
            $session = new PuzzleSession();
        }

        /** @var Puzzle $puzzle */
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $puzzleId]);
        if($puzzle) {
            $session->setPuzzle($puzzle);
        } else {
            return new JsonResponse(['message' => 'No puzzle found.'], 400);
        }

        if(!$session->getCompleteness()){
            $session->setCompleteness(0);
        }

        /** @var Team $team */
        /** @var Account $memberAccount  $memberAccount */
        $team = $em->getRepository(Team::class)->findOneBy(['id' => $teamId]);
        if($team){
            $session->setTeamPlayer($team);
            $em->persist($session);
            foreach ($team->getMembers() as $memberAccount) {
                $puzzles = $memberAccount->getPuzzlesEnrolledAt();
                if($puzzles->contains($puzzle) && $memberAccount->getId() === $account->getId()){
                    continue;
                }

                if($puzzles->contains($puzzle)) {
                    return new JsonResponse([
                        'message' => 'A member of the team is already registered for this puzzle.',
                    ], 400);
                }
                $puzzles->add($puzzle);
                $memberAccount->setPuzzlesEnrolledAt($puzzles);

                $sessions = $memberAccount->getPuzzleSessions();
                $sessions->add($session);
                $memberAccount->setPuzzleSessions($sessions);

                $em->persist($memberAccount);
            }

            $teams = $puzzle->getEnrolledTeams();
            $teams->add($team);
            $puzzle->setEnrolledTeams($teams);
            $em->persist($puzzle);
        } else {
            return new JsonResponse(['message' => 'No team found.'], 400);
        }


        $em->flush();

        $sessionJson = $serializer->serialize($session, 'json', [
            'attributes' => [
                'teamPlayer' => [
                    'name',
                    'members' => [
                        'user' => ['fullName']
                    ]
                ],
                'completeness',
            ],
        ]);

        return new JsonResponse(json_decode($sessionJson, true), 200);
    }
}
