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
                            'members' => ['user' => ['fullName']],
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
                                'members' => ['user' => ['fullName']],
                            ],
                            'completeness',
                        ],
                    ]);

                    return new JsonResponse(json_decode($sessionJson, true), 200);
                }
            }
        }

        return new JsonResponse(null, 204);
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
                return new JsonResponse(null, 204);
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
                return new JsonResponse(null, 204);
        }

        $puzzles = $account->getPuzzlesEnrolledAt();
        $puzzles->add($puzzle);
        $account->setPuzzlesEnrolledAt($puzzles);

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
     * @Route("/api/enroll-team/{puzzleId}/{teamId}", name="puzzle_sessions.enroll-team", methods={"POST"})
     * @param $puzzleId
     * @param $teamId
     * @return JsonResponse
     */
    public function enrollTeam($puzzleId, $teamId): JsonResponse
    {
        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $puzzleSession = null;
        foreach ($account->getPuzzleSessions() as $session) {
            if($session->getPuzzle()->getId() === (int)$puzzleId) {
                $puzzleSession = $session;
            }
        }

        if(!$puzzleSession) {
            $em = $this->getDoctrine()->getManager();
            $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $puzzleId]);
            $puzzleSession = new PuzzleSession();
            if($puzzle) {
                /** @var Puzzle $puzzle */
                $puzzleSession->setPuzzle($puzzle);
            } else {
                return new JsonResponse(null, 204);
            }
            $puzzleSession->setCompleteness(0);
            $team = $em->getRepository(Team::class)->findOneBy(['id' => $teamId]);
            if($team){
                /** @var Team $team */
                $puzzleSession->setTeamPlayer($team);
                /** @var Account $memberAccount  $memberAccount */
                $em->persist($puzzleSession);
                foreach ($team->getMembers() as $memberAccount) {
                    $puzzles = $memberAccount->getPuzzlesEnrolledAt();
                    if($puzzles->contains($puzzle)) {
                        return new JsonResponse(json_encode([
                            'message' => 'A member of the team is already registered for this puzzle.',
                        ]), 400);
                    }
                    $puzzles->add($puzzle);
                    $memberAccount->setPuzzlesEnrolledAt($puzzles);

                    $sessions = $memberAccount->getPuzzleSessions();
                    $sessions->add($puzzleSession);
                    $memberAccount->setPuzzleSessions($sessions);

                    $em->persist($memberAccount);
                }
                $em->flush();
            } else {
                return new JsonResponse(null, 204);
            }
            if ($puzzle) {
                /** @var Puzzle $puzzle */
                $puzzleSession->setPuzzle($puzzle);
            } else {
                return new JsonResponse(null, 204);
            }
            $em->flush();
        }

        $puzzleSessionJson = $serializer->serialize($puzzleSession, 'json', [
            'attributes' => [
                'teamPlayer' => [
                    'name',
                    'members' => ['user' => ['fullName']],
                ],
                'completeness',
            ],
        ]);

        return new JsonResponse(json_decode($puzzleSessionJson, true), 200);
    }
}
