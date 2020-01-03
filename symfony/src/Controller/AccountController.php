<?php

namespace App\Controller;

use App\Repository\AccountRepository;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class AccountController extends AbstractFOSRestController
{
    /**
     * @Route("/api/account", name="account.index", methods={"GET"})
     * @return JsonResponse
     */
    public function index() : JsonResponse
    {
        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $account = $serializer->serialize($this->getUser()->getAccount(), 'json', [
            'attributes' => [
                'user' => ['username', 'email', 'fullName'],
                'puzzlesSolvedCount',
                'puzzlesEnrolledAt' => ['name'],
                'winedContestsCount',
                'puzzleSessions' => ['puzzle' => ['name']],
                'createdPuzzles' => ['name'],
                'createdTeams' => ['name'],
                'createdContests' => ['name'],
                'contestsEnrolledAt' => ['name'],
                'teamsMemberOf' => ['name']
            ]
        ]);

        return new JsonResponse(json_decode($account, true));
    }

    /**
     * @Route("/api/account/requesting_teams", name="account.requesting_teams", methods={"GET"})
     * @return JsonResponse
     */
    public function getRequestingTeams() : JsonResponse
    {
        $requestingTeams = $this->getUser()->getAccount()->getRequestingTeams();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $requestingTeamsJson = $serializer->serialize($requestingTeams, 'json', [
            'attributes' => [
                'id',
                'name'
            ]
        ]);

        return new JsonResponse(json_decode($requestingTeamsJson, true));
    }

    /**
     * @Route("/api/account/accept_team/{team_id}", name="account.accept_team", methods={"POST"})
     * @param AccountRepository $accountRepository
     * @param int $team_id
     * @return Response
     */
    public function acceptTeam(AccountRepository $accountRepository, int $team_id) : Response
    {

        $success = $accountRepository->acceptTeam($team_id, $this->getUser());

        if(!$success) {
            return new Response(
                'Server error',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Team accepted',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
    }

    /**
     * @Route("/api/account/decline_team/{team_id}", name="account.decline_team", methods={"POST"})
     * @param AccountRepository $accountRepository
     * @param int $team_id
     * @return Response
     */
    public function declineTeam(AccountRepository $accountRepository, int $team_id) : Response
    {

        $success = $accountRepository->declineTeam($team_id, $this->getUser());

        if(!$success) {
            return new Response(
                'Server error',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Team declined',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
    }

    /**
     * @Route("/api/account/username", name="account.username", methods={"GET"})
     * @return JsonResponse
     */
    public function getUsername() : JsonResponse
    {
        $username = $this->getUser()->getUsername();
        return new JsonResponse(['username' => $username], 200);
    }
}
