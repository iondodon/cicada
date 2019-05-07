<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Form\UserType;
use App\Entity\User;
use App\Event\EmailRegistrationUserEvent;

class RegistrationController extends FOSRestController
{
    /**
     * @Route(path="/api/register", name="registration")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function postRegisterAction(Request $request): JsonResponse
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPassword());
            $user->setPassword($password);
            $user->setRoles(['ROLE_ADMIN']);
            $em = $this->getDoctrine()->getManager();

            $event = new EmailRegistrationUserEvent($user);
            $dispatcher = $this->get('event_dispatcher');
            $dispatcher->dispatch(EmailRegistrationUserEvent::NAME, $event);

            $em->persist($user);
            $em->flush();

            return new JsonResponse(['status' => 'ok']);
        }

        throw new HttpException(400, "Invalid data");
    }
}
