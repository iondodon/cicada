<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Team;
use App\Repository\TeamRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
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
     * @Route("/api/teams/member_of", name="teams.get_teams_member_of", methods={"GET"})
     * @param EntityManagerInterface $em
     * @return JsonResponse
     */
    public function getTeamsMemberOf(EntityManagerInterface $em): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $query = $em->createQuery('SELECT t FROM App\Entity\Team t JOIN t.members acc WHERE acc.id = :id')
            ->setParameter('id', $account->getId());
        $teams = $query->getResult();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $teamsJson = $serializer->serialize($teams, 'json', [
            'attributes' => [
                'id',
                'name',
                'members' => [
                    'id',
                    'user' => ['fullName']
                ],
                'winedContestsCount',
                'creator' => ['user' => ['fullName']],
                'puzzlesSolvedCount'
            ]
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
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $team = $em->getRepository(Team::class)->findOneBy(['id' => $id]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $teamJson = $serializer->serialize($team, 'json', [
            'attributes' => [
                'id',
                'name',
                'members' => ['user' => ['fullName', 'username']],
                'puzzlesSolvedCount',
                'winedContestsCount',
                'puzzleSessions' => [
                    'id',
                    'puzzle' => ['id', 'name'],
                    'contest' => ['id', 'name']
                ],
                'creator' => ['id', 'user' => ['fullName']]
            ]
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
            'Error. Maybe this team does not exist. Or this user cannot update this team.', Response::HTTP_INTERNAL_SERVER_ERROR, ['content-type'=> 'text/html']
        );
    }

    /**
     * @Route("/api/teams/destroy/{id}", name="teams.destroy", methods={"DELETE"})
     * @param $id
     * @return Response
     */
    public function destroy(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();

        /** @var Team $team */
        $team = $em->getRepository(Team::class)->findOneBy(['id' => $id]);
        foreach ($team->getPuzzleSessions() as $sess) {
            $em->remove($sess);
        }

        $em->remove($team);
        $em->flush();

        return new Response(
            'Team deleted.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
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

    /**
     * @Route("/api/teams/leave-team/{teamId}", name="teams.leave-team", methods={"POST"})
     * @param $teamId
     * @return JsonResponse
     */
    public function leaveTeam($teamId): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        /** @var Team $team */
        $team = $em->getRepository(Team::class)->find($teamId);
        if(!$team) {
            return new JsonResponse(['message' => 'Team not found.'], 400);
        }

        /** @var Account $account */
        /** @var ArrayCollection  $members */
        $account = $this->getUser()->getAccount();
        $members = $team->getMembers();
        $members->removeElement($account);

        $team->setMembers($members);

        $em->persist($team);
        $em->flush();

        return new JsonResponse(null, 200);
    }

    /**
     * @Route("/api/my_teams", name="teams.my_teams", methods={"GET"})
     * @return JsonResponse
     */
    public function getMyTeams(): JsonResponse
    {
        /** @var Account $account */
        $account = $this->getUser()->getAccount();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $contestsJson = $serializer->serialize($account->getCreatedTeams(), 'json', [
            'attributes' => [
                'id',
                'name',
                'members' => [
                    'id',
                    'user' => ['fullName']
                ],
                'winedContestsCount',
                'creator' => ['user' => ['fullName']],
                'puzzlesSolvedCount'
            ]
        ]);

        return new JsonResponse(json_decode($contestsJson, true));
    }
}
