<?php

namespace App\Controller;

use App\Entity\Notification;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class NotificationController extends AbstractFOSRestController
{
    /**
     * @Route("/api/notifications", name="notifications.getAll", methods={"GET"})
     * @return JsonResponse
     */
    public function getAll(): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $destination_account_id = $this->getUser()->getAccount()->getId();
        $notifications = $em->getRepository(Notification::class)
            ->findBy(['destinationAccount' => $destination_account_id]);

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $notificationsJson = $serializer->serialize($notifications, 'json', [
            'attributes' => [
                'id',
                'type',
                'sourceAccount' => ['user' => ['fullName']]
            ]
        ]);

        return new JsonResponse(json_decode($notificationsJson, true));
    }

    /**
     * @Route("/api/notifications/{id}", name="notifications.destroy", methods={"DELETE"})
     * @param $id
     * @return Response
     */
    public function destroy(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();
        $notification = $em->getRepository(Notification::class)->findOneBy(['id' => $id]);

        if($notification) {
            $em->remove($notification);
            $em->flush();
            return new Response(
                'Notification deleted.', Response::HTTP_OK, ['content-type' => 'text/html']
            );
        }

        return new Response(
            'Notification not found.', Response::HTTP_NOT_FOUND, ['content-type' => 'text/html']
        );
    }
}
