<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Puzzle;
use App\Entity\PuzzleSession;
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
                            'members' => ['user' => ['fullName']]
                        ],
                        'completeness'
                    ]
                ]);

                return new JsonResponse(json_decode($sessionJson, true), 200);
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
            if($session->getPuzzle()->getId() === $puzzleId) {
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

        $em->persist($session);
        $em->flush();

        return new JsonResponse(null, 200);
    }
}
