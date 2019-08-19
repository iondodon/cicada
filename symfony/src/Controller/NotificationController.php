<?php

namespace App\Controller;

use App\Entity\Notification;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class NotificationController extends AbstractFOSRestController
{
    /**
     * @Route("/api/notifications/{destination_account_id}", name="notifications.getAll", methods={"GET"})
     * @param int $destination_account_id
     * @return JsonResponse
     */
    public function getAll(int $destination_account_id): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $notifications = $em->getRepository(Notification::class)
            ->findBy(['destinationAccount' => $destination_account_id]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $notificationsJson = $serializer->serialize($notifications, 'json', [
            'circular_reference_handler' => static function ($object) {
                return $object->getId();
            }
        ]);

        return new JsonResponse(json_decode($notificationsJson, true));
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
        $notification = $em->getRepository(Notification::class)->findOneBy(['id' => $id]);

        $em->remove($notification);
        $em->flush();

        $response = new Response(
            'Notification deleted.',
            Response::HTTP_OK,
            ['content-type' => 'text/html']
        );

        return $response;
    }
}
