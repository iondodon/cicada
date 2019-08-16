<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Notification;
use App\Entity\Team;
use App\Entity\User;
use App\Repository\TeamRepository;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class TeamController extends AbstractFOSRestController
{
    /**
     * @Route("/api/teams", name="teams.index", methods={"GET"})
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $teams = $em->getRepository(Team::class)->findAll();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $teamsJson = $serializer->serialize($teams, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        return new JsonResponse(json_decode($teamsJson, true));
    }

    /**
     * @Route("/api/teams/create", name="teams.create", methods={"POST"})
     * @param Request $request
     * @param TeamRepository $teamRepository
     * @return Response
     */
    public function create(Request $request, TeamRepository $teamRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $success = $teamRepository->createTeamAndSave($data, $this->getUser());

        if(!$success){
            return new Response(
                'Team wasn\'t saved',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Team successfully saved.',
            Response::HTTP_CREATED,
            ['content-type' => 'text/html']
        );
    }

    /**
     * @Route("/api/teams/{id}", name="teams.show", methods={"GET"})
     * @param $id
     * @param TeamRepository $teamRepository
     * @return JsonResponse
     */
    public function show($id, TeamRepository $teamRepository): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $team = $em->getRepository(Team::class)->findOneBy(['id' => $id]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $teamJson = $serializer->serialize($team, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        $jsonResponse = new JsonResponse(json_decode($teamJson, true));

        if(!$team){
            $jsonResponse->setStatusCode(204);
        }

        return $jsonResponse;
    }

    /**
     * @Route("/api/teams/{id}", name="teams.update", methods={"PUT"})
     * @param TeamRepository $teamRepository
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function update(TeamRepository $teamRepository, Request $request, $id): Response
    {
        $editedTeam = json_decode($request->getContent(), true);
        $success = $teamRepository->updateTeam($editedTeam, $this->getUser(), $id);

        if($success) {
            return new Response(
                'Team updated.', Response::HTTP_OK, ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Error. Maybe this team does not exist. ', Response::HTTP_NOT_FOUND, ['content-type'=> 'text/html']
        );
    }

    /**
     * @Route("/api/teams/destroy/{id}", name="teams.destroy", methods={"DELETE"})
     * @param Request $request
     * @param $id
     * @return Response
     */
    public function destroy(Request $request, int $id): Response
    {
        $em = $this->getDoctrine()->getManager();
        $team = $em->getRepository(Team::class)->findOneBy(['id' => $id]);

        $em->remove($team);
        $em->flush();

        $response = new Response(
            'Team deleted.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );

        return $response;
    }

    /**
     * @Route("/api/teams/exists/{name}", name="teams.exists", methods={"GET"})
     * @param $name
     * @return Response
     */
    public function teamExists($name): Response
    {
        $em = $this->getDoctrine()->getManager();
        $team = $em->getRepository(Team::class)->findOneBy(['name' => $name]);

        $response = new Response();

        if(!$team){
            $response->setStatusCode(Response::HTTP_NO_CONTENT);
            return $response;
        }

        $response->setStatusCode(Response::HTTP_FOUND);
        return $response;
    }
}
