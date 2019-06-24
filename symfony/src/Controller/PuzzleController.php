<?php

namespace App\Controller;

use App\Entity\Puzzle;
use App\Entity\Tag;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PuzzleController extends AbstractFOSRestController
{
    /**
     * @Route("/api/puzzles/create", name="puzzles.create", methods={"POST"})
     * @param Request $request
     * @return Response
     * @throws \Exception
     */
    public function create(Request $request) : Response
    {
        $data = json_decode($request->getContent(), true);
        $em = $this->getDoctrine()->getManager();

        $puzzle = new Puzzle();
        $puzzle->setName($data['name']);

        $tags = new ArrayCollection();
        foreach($data['tags'] as $tg){
            $tag = $em->getRepository(Tag::class)->findOneBy(['tag' => $tg]);
            if(!$tag) {
                $tag = new Tag();
                $tag->setTag($tg);
                $em->persist($tag);
            }
            $tags->add($tag);
        }
        $puzzle->setTags($tags);

        $puzzle->setIsPrivate($data['isPrivate']);
        $puzzle->setDifficultyByCreator($data['difficultyByCreator']);
        $puzzle->setDifficultyByStatistics($data['difficultyByCreator']);
        $puzzle->setStagesCount(0);
        $puzzle->setCreatedBy($this->getUser()->getAccount());
        $puzzle->setCreatedAt(new DateTime());

        $em->persist($puzzle);
        $em->flush();

        $response = new Response(
            'Puzzle created.',
            Response::HTTP_CREATED,
            ['content-type' => 'text/html']
        );

        return $response;
    }
}
