<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Contest;
use App\Entity\PuzzleSession;
use App\Entity\Team;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ContestRepository;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ContestController extends AbstractFOSRestController
{
    /**
     * @Route("/api/contests", name="contests.index", methods={"GET"})
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $query = $em->createQuery('SELECT c FROM  App\Entity\Contest c WHERE c.isPrivate = 0');
        $contests = $query->getResult();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $contestsJson = $serializer->serialize($contests, 'json', [
            'attributes' => [
                'id',
                'name',
                'puzzle' => ['name'],
                'createdBy' => ['user' => ['fullName']]
            ]
        ]);

        return new JsonResponse(json_decode($contestsJson, true));
    }

    /**
     * @Route("/api/my_contests", name="contests.my_contests", methods={"GET"})
     * @return JsonResponse
     */
    public function getMyContests(): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $contestsJson = $serializer->serialize($account->getCreatedContests(), 'json', [
            'attributes' => [
                'id',
                'name',
                'puzzle' => ['name'],
                'createdBy' => ['user' => ['fullName']]
            ]
        ]);

        return new JsonResponse(json_decode($contestsJson, true));
    }

    /**
     * @Route("/api/contests/create", name="contests.create", methods={"POST"})
     * @param Request $request
     * @param ContestRepository $contestRepository
     * @return Response
     */
    public function create(Request $request, ContestRepository $contestRepository): Response
    {
        $data = json_decode($request->getContent(), true);


        $contest_exists = $contestRepository->contestExists($data);

        if($contest_exists){
            return new Response(
                'A contest with this name already exists.',
                Response::HTTP_BAD_REQUEST,
                ['content-type' => 'text/html']
            );
        }

        $puzzle_exists = $contestRepository->puzzleExists($data);

        if(!$puzzle_exists){
            return new Response(
                'A puzzle with such a name does not exist.',
                Response::HTTP_BAD_REQUEST,
                ['content-type' => 'text/html']
            );
        }

        $created = $contestRepository->createContestAndSave($data, $this->getUser());

        if(!$created){
            return new Response(
                'Contest wasn\'t created. Server Error.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Contest successfully created.',
            Response::HTTP_CREATED,
            ['content-type' => 'text/html']
        );
    }

    /**
     * @Route("/api/contests/get/{id}", name="contests.get", methods={"GET"})
     * @param $id
     * @return JsonResponse
     */
    public function get($id): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->findOneBy(['id' => $id]);

        if($contest->getCreatedBy()->getId() !== $this->getUser()->getAccount()->getId()){
            return new JsonResponse('Unauthorized', 401);
        }

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $contestJson = $serializer->serialize($contest, 'json', [
            'attributes' =>[
                'name',
                'puzzle' => ['id', 'name'],
                'code',
                'startsAt' => ['timestamp'],
                'finishesAt' => ['timestamp'],
                'private'
            ]
        ]);
        $jsonResponse = new JsonResponse(json_decode($contestJson, true));

        if(!$contest){
            $jsonResponse->setStatusCode(204);
        }

        return $jsonResponse;
    }

    /**
     * @Route("/api/contests/{id}", name="contests.show", methods={"GET"})
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->findOneBy(['id' => $id]);

//        if($contest->getCreatedBy()->getId() !== $this->getUser()->getAccount()->getId()){
//            return new JsonResponse('Unauthorized', 401);
//        }

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $contestJson = $serializer->serialize($contest, 'json', [
            'attributes' =>[
                'id',
                'name',
                'puzzle' => ['id', 'name'],
                'startsAt' => ['timestamp'],
                'finishesAt' => ['timestamp'],
                'createdAt' => ['timestamp'],
                'createdBy' => ['id', 'user' => ['fullName']],
                'sessions' => [
                    'id',
                    'singlePlayer' => ['user' => ['id', 'fullName']],
                    'teamPlayer' => ['id', 'name'],
                    'contest' => ['id', 'name']
                ],
                'singlePlayerWinner' => [
                        'user' => ['fullName']
                ],
                'teamWinner' => ['id', 'name']
            ]
        ]);
        $jsonResponse = new JsonResponse(json_decode($contestJson, true));

        if(!$contest){
            $jsonResponse->setStatusCode(204);
        }

        return $jsonResponse;
    }

    /**
     * @Route("/api/contests/{id}", name="contests.update", methods={"PUT"})
     * @param Request $request
     * @param $id
     * @return Response
     * @throws \Exception
     */
    public function update(Request $request, $id): Response
    {
        $editedContest = json_decode($request->getContent(), true);
        $em = $this->getDoctrine()->getManager();

        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->find($id);

        if($contest->getCreatedBy()->getId() !== $this->getUser()->getAccount()->getId()){
            return new Response('Unauthorized', 401);
        }

        /** @var $contest Contest */
        if($contest) {
            $contest->setName($editedContest['contestName']);

            $contest->setIsPrivate($editedContest['isPrivate']);
            $contest->setCode($editedContest['code']);

            $contest->setStartsAt(new DateTime($editedContest['startsAt']));
            $contest->setFinishesAt(new DateTime($editedContest['finishesAt']));

            $em->persist($contest);
            $em->flush();

            return new Response('Contest successfully updated', 200);
        }

        return new Response('Such contest does not exist', 400);
    }

    /**
     * @Route("/api/contests/destroy/{id}", name="contests.destroy", methods={"DELETE"})
     * @param int $id
     * @param EntityManagerInterface $em
     * @return Response
     */
    public function destroy(int $id, EntityManagerInterface $em): Response
    {
        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->find($id);

        $query = $em->createQuery('SELECT ps FROM App\Entity\PuzzleSession ps JOIN ps.contest c WHERE c.id = :id')
            ->setParameter('id',$id);
        $puzzleSessions = $query->getResult();

        /** @var PuzzleSession $sess */
        foreach ($puzzleSessions as $sess) {
            $sess->setContest(null);
            $em->persist($sess);
        }

        $em->remove($contest);
        $em->flush();

        return new Response(
            'Contest deleted.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
    }

    /**
     * @Route("/api/contests/get-enrolled/{id}", name="contests.get-enrolled", methods={"GET"})
     * @param $id
     * @return JsonResponse
     */
    public function getEnrolled(int $id): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        /** @var Contest $contest */
        $contest = $em->getRepository(Contest::class)->find($id);

        if(!$contest) {
            return new JsonResponse(['message' => 'Such a contest does not exist.'], 400);
        }

        /** @var Account $account */
        $account = $this->getUser()->getAccount();
        /** @var PuzzleSession $session */
        foreach ($account->getPuzzleSessions() as $session) {
            if($session->getContest() && $session->getContest()->getId() == $id) {
                if($session->getSinglePlayer()) {
                    return new JsonResponse(
                        [
                            'enrolled' => true,
                            'singlePlayer' => true,
                            'singlePlayerId' => $account->getId(),
                            'teamPlayer' => false
                        ], 200);
                } else if($session->getTeamPlayer()) {
                    return new JsonResponse(
                        [
                            'enrolled' => true,
                            'singlePlayer' => false,
                            'teamPlayer' => true,
                            'teamName' => $session->getTeamPlayer()->getName(),
                            'teamId' => $session->getTeamPlayer()->getId()
                        ], 200);
                }
            }
        }

        /** @var Team $teamMemberOf */
        foreach ($account->getTeamsMemberOf() as $teamMemberOf) {
            foreach ($teamMemberOf->getPuzzleSessions() as $session) {
                if($session->getContest() && $session->getContest()->getId() == $id) {
                    if($session->getSinglePlayer()) {
                        return new JsonResponse(
                            [
                                'enrolled' => true,
                                'singlePlayer' => true,
                                'singlePlayerId' => $account->getId(),
                                'teamPlayer' => false
                            ], 200);
                    } else if($session->getTeamPlayer()) {
                        return new JsonResponse(
                            [
                                'enrolled' => true,
                                'singlePlayer' => false,
                                'teamPlayer' => true,
                                'teamName' => $session->getTeamPlayer()->getName(),
                                'teamId' => $session->getTeamPlayer()->getId()
                            ], 200);
                    }
                }
            }
        }

        return new JsonResponse(['enrolled' => false], 200);
    }
}
