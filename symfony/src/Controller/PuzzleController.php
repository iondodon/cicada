<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Contest;
use App\Entity\Puzzle;
use App\Entity\PuzzleSession;
use App\Entity\Stage;
use App\Entity\Tag;
use App\Repository\PuzzleRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Exception;
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
        $query = $em->createQuery('SELECT p FROM App\Entity\Puzzle p WHERE p.isPrivate = 0');
        $puzzles = $query->getResult();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $puzzlesJson = $serializer->serialize($puzzles, 'json', [
            'attributes' => [
                'id',
                'name',
                'createdBy' => ['user' => ['fullName']],
                'difficultyByCreator',
                'difficultyByStatistics',
                'stagesCount'
            ]
        ]);

        return new JsonResponse(json_decode($puzzlesJson, true));
    }

    /**
     * @Route("/api/my_puzzles", name="puzzles.my_puzzles", methods={"GET"})
     * @return JsonResponse
     */
    public function getMyPuzzles(): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $puzzlesJson = $serializer->serialize($account->getCreatedPuzzles(), 'json', [
            'attributes' => [
                'id',
                'name',
                'difficultyByCreator',
                'difficultyByStatistics',
                'stagesCount'
            ]
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
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $puzzleJson = $serializer->serialize($puzzle, 'json', [
            'attributes' => [
                'id',
                'name',
                'createdBy' => [
                    'id',
                    'user' => ['id', 'fullName']
                ],
                'createdAt' => ['timestamp'],
                'difficultyByCreator',
                'difficultyByStatistics',
                'tags' => ['id', 'tag'],
                'description'
            ]
        ]);

        $jsonResponse = new JsonResponse(json_decode($puzzleJson, true));

        if(!$puzzle){
            $jsonResponse->setStatusCode(204);
        }

        return $jsonResponse;
    }

    /**
     * @Route("/api/puzzles/get-for-update/{id}", name="puzzles.getForUpdate", methods={"GET"})
     * @param $id
     * @return Response
     * @throws Exception
     */
    public function getForUpdate($id): Response
    {
        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        if(!$puzzle) {
            return new JsonResponse(['message' => 'Puzzle not found.'], 404);
        }

        /** @var Account $account */
        $account = $this->getUser()->getAccount();
        if($puzzle->getCreatedBy()->getId() !== $account->getId()) {
            return new JsonResponse(['message' => 'You can not update this puzzle.'], 400);
        }

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $puzzleJson = $serializer->serialize($puzzle, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        return new JsonResponse(json_decode($puzzleJson, true), 200);
    }

    /**
     * @Route("/api/puzzles/{id}", name="puzzles.update", methods={"PUT"})
     * @param Request $request
     * @param $id
     * @return Response
     * @throws Exception
     */
    public function update(Request $request, $id): Response
    {
        $editedPuzzle = json_decode($request->getContent(), true);

        $em = $this->getDoctrine()->getManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        if($puzzle) {
            if($this->getUser()->getAccount()->getId() !== $puzzle->getCreatedBy()->getId()) {
                return new Response(
                    'This user cannot update the puzzle.',
                    Response::HTTP_INTERNAL_SERVER_ERROR,
                    ['content-type' => 'text/html']
                );
            }

            $puzzle->setName($editedPuzzle['name']);
            $puzzle->setDescription($editedPuzzle['description']);
            $puzzle->setStagesCount($editedPuzzle['stagesCount']);
            $puzzle->setIsPrivate($editedPuzzle['isPrivate']);

            $stages = new ArrayCollection();
            foreach ($editedPuzzle['stages'] as $editedStage) {
                $stageLevel = $editedStage['level'];
                $stage = $em->getRepository(Stage::class)->findOneBy(['level' => $stageLevel]);
                if($stage){
                    $stage->setDescription($editedStage['description']);
                    $stage->setCode($editedStage['code']);
                    $stage->setUpdatedAt(new DateTime());

                    $em->persist($stage);
                    $stages->add($stage);
                } else {
                    $newStage = new Stage();
                    $newStage->setCreatedAt(new DateTime());
                    $newStage->setCode($editedStage['code']);
                    $newStage->setDescription($editedStage['description']);
                    $newStage->setLevel($editedStage['level']);
                    /** @var $puzzle Puzzle */
                    $newStage->setPuzzleParent($puzzle);

                    $em->persist($newStage);
                    $stages->add($newStage);
                }
            }
            $puzzle->setStages($stages);

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
     * @param $id
     * @return Response
     */
    public function destroy(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Puzzle $puzzle */
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['id' => $id]);

        foreach($puzzle->getStages() as $stage) {
            $em->remove($stage);
        }

        $sessions = $em->getRepository(PuzzleSession::class)->findBy(['puzzle' => $puzzle]);
        foreach ($sessions as $sess) {
            $em->remove($sess);
        }

        $sessions = $em->getRepository(Contest::class)->findBy(['puzzle' => $puzzle]);
        foreach ($sessions as $sess) {
            $em->remove($sess);
        }

        $em->remove($puzzle);

        $em->flush();

        return new Response(
            'Puzzle deleted.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
    }
}
