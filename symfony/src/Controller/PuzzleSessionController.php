<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Puzzle;
use App\Entity\PuzzleSession;
use App\Entity\Stage;
use App\Entity\Team;
use Doctrine\Common\Collections\Collection;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        /** @var Team $team */
        foreach ($account->getTeamsMemberOf() as $team) {
            foreach ($team->getPuzzleSessions() as $session) {
                if($session->getPuzzle()->getId() === (int)$puzzleId) {
                    $session = $this->extractUnnecessaryStages($session);
                    $sessionJson = $serializer->serialize($session, 'json', [
                        'attributes' => [
                            'id',
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
                        ],
                    ]);

                    return new JsonResponse(json_decode($sessionJson, true), 200);
                }
            }
        }

        foreach ($account->getPuzzleSessions() as $session) {
            if($session->getPuzzle()->getId() === (int)$puzzleId) {
                $session = $this->extractUnnecessaryStages($session);
                $sessionJson = $serializer->serialize($session, 'json', [
                    'attributes' => [
                        'id',
                        'singlePlayer' => [
                            'id',
                            'user' => [
                                'fullName'
                            ]
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
                    ],
                ]);

                return new JsonResponse(json_decode($sessionJson, true), 200);
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
     * @Route("/api/enroll-team/{puzzleId}/{teamId}", name="puzzle_sessions.enroll-team", methods={"POST"})
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
}
