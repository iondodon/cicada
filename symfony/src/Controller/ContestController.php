<?php

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ContestRepository;

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

    }

    /**
     * @Route("/api/contests/{id}", name="contests.show", methods={"GET"})
     * @param $id
     * @param ContestRepository $contestRepository
     * @return JsonResponse
     */
    public function show($id, ContestRepository $contestRepository): JsonResponse
    {
        
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
