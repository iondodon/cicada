<?php

namespace App\Controller;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class AccountController extends AbstractFOSRestController
{
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
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        return new JsonResponse(json_decode($requestingTeamsJson, true));
    }
}
