<?php

namespace App\Controller;

use App\Entity\Puzzle;
use App\Entity\Tag;
use App\Repository\PuzzleRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class PuzzleController extends AbstractFOSRestController
{
    /**
     * @Route("/api/puzzles", name="puzzles.index", methods={"GET"})
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $puzzles = $em->getRepository(Puzzle::class)->findAll();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $puzzlesJson = $serializer->serialize($puzzles, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        return new JsonResponse(json_decode($puzzlesJson, true));
    }

    /**
     * @Route("/api/puzzles/create", name="puzzles.create", methods={"POST"})
     * @param Request $request
     * @param PuzzleRepository $puzzleRepository
     * @return Response
     */
    public function create(Request $request, PuzzleRepository $puzzleRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $success = $puzzleRepository->createPuzzleAndSave($data, $this->getUser());

        if(!$success){
            return new Response(
                'Puzzle wasn\'t saved',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Puzzle successfully saved.',
            Response::HTTP_CREATED,
            ['content-type' => 'text/html']
        );
    }

    /**
     * @Route("/api/puzzles/{id}", name="puzzles.show", methods={"GET"})
     * @param $id
     * @param PuzzleRepository $puzzleRepository
     * @return JsonResponse
     */
    public function show($id, PuzzleRepository $puzzleRepository): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $puzzleJson = $serializer->serialize($puzzle, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        $jsonResponse = new JsonResponse(json_decode($puzzleJson, true));

        if(!$puzzle){
            $jsonResponse->setStatusCode(204);
        }

        return $jsonResponse;
    }

    /**
     * @Route("/api/puzzles/{id}", name="puzzles.update", methods={"PUT"})
     * @param Request $request
     * @param $id
     * @return Response
     * @throws \Exception
     */
    public function update(Request $request, $id): Response
    {
        $editedPuzzle = json_decode($request->getContent(), true);

        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        if($puzzle) {

            $puzzle->setName($editedPuzzle['name']);
            $puzzle->setStagesCount($editedPuzzle['stagesCount']);
            $puzzle->setIsPrivate($editedPuzzle['isPrivate']);
            $tags = new ArrayCollection();
            foreach ($editedPuzzle['tags'] as $tg) {
                $tag = $em->getRepository(Tag::class)->findOneBy(['tag' => $tg]);
                if (!$tag) {
                    $tag = new Tag();
                    $tag->setTag($tg);
                    $em->persist($tag);
                }
                $tags->add($tag);
            }
            $puzzle->setTags($tags);
            $puzzle->setUpdatedAt(new DateTime());
            $puzzle->setDifficultyByCreator($editedPuzzle['difficultyByCreator']);
            $em->persist($puzzle);
            $em->flush();

            return new Response(
                'Puzzle updated.', Response::HTTP_OK, ['content-type' => 'text/html']
            );
        }

        return new Response(
            'No such puzzle', Response::HTTP_NOT_FOUND, ['content-type'=> 'text/html']
        );
    }

    /**
     * @Route("/api/puzzles/destroy/{id}", name="puzzles.destroy", methods={"DELETE"})
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function destroy(Request $request, int $id): Response
    {
        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        $em->remove($puzzle);
        $em->flush();

        $response = new Response(
            'Puzzle deleted.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );

        return $response;
    }
}
