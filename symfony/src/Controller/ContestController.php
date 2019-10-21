<?php

namespace App\Controller;

use App\Entity\Contest;
use DateTime;
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

    }

    /**
     * @Route("/api/my_contests", name="contests.my_contests", methods={"GET"})
     * @return JsonResponse
     */
    public function getMyContests(): JsonResponse
    {

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
                'puzzle' => ['name'],
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

        if($contest->getCreatedBy()->getId() !== $this->getUser()->getAccount()->getId()){
            return new JsonResponse('Unauthorized', 401);
        }

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $contestJson = $serializer->serialize($contest, 'json', [
            'attributes' =>[
                'name',
                'puzzle' => ['name'],
                'startsAt' => ['timestamp'],
                'finishesAt' => ['timestamp'],
                'createdAt' => ['timestamp'],
                'createdBy' => ['user' => ['fullName']],
                'enrolledPlayers' => ['user' => ['fullName']],
                'enrolledTeams' => ['name']
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
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function destroy(Request $request, int $id): Response
    {

    }
}
