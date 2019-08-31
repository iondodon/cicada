<?php

namespace App\Controller;

use App\Entity\User;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use FOS\RestBundle\Controller\Annotations\Route;

class UserController extends AbstractFOSRestController
{
    /**
     * @Route("/api/users/{username}", name="users.find", methods={"GET"})
     * @param $username
     * @return JsonResponse
     */
    public function findUser($username): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $userJson = $serializer->serialize($user, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        $jsonResponse = new JsonResponse(json_decode($userJson, true));

        if(!$user){
            $jsonResponse->setStatusCode(204);
        }

        return $jsonResponse;
    }

    /**
     * @Route("/api/users/exists/{username}", name="users.exists", methods={"GET"})
     * @param $username
     * @return Response
     */
    public function userExists($username): Response
    {
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);

        $response = new Response();

        if(!$user){
            $response->setStatusCode(Response::HTTP_NO_CONTENT);
            return $response;
        }

        $response->setStatusCode(Response::HTTP_FOUND);
        return $response;
    }

    /**
     * @Route("/api/users/{new_username}", name="users.change_username", methods={"PUT"})
     * @param $new_username
     * @return Response
     */
    public function changeUsername($new_username): Response
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();

        $user->setUsername($new_username);

        $em->persist($user);
        $em->flush();

        return new Response(
            'Username successfully changed.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );
    }
}
