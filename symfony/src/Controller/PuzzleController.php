<?php

namespace App\Controller;

use App\Entity\Puzzle;
use DateTime;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class PuzzleController extends AbstractFOSRestController
{
    /**
     * @Route("/api/puzzles/create", name="puzzles.create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function indexAction(Request $request) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $puzzle = new Puzzle();
        $puzzle->setName($data['name']);
        //$puzzle->setTags($data['tags']);
        $puzzle->setIsPrivate($data['isPrivate']);
        $puzzle->setDifficultyByCreator($data['difficultyByCreator']);
        $puzzle->setDifficultyByStatistics($data['difficultyByCreator']);
        $puzzle->setStagesCount(0);
        $puzzle->setCreatedBy($this->getUser()->getAccount());
        $puzzle->setCreatedAt(new DateTime());

        $em = $this->getDoctrine()->getManager();
        $em->persist($puzzle);
        $em->flush();

        return new JsonResponse($data);
    }
}
