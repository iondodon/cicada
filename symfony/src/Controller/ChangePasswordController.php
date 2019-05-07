<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Form\ChangePasswordType;
use App\Entity\User;
use App\Event\EmailChangePasswordEvent;

class ChangePasswordController extends FOSRestController
{
    /**
     * @Route(path="api/changePassword", name="change_password")
     */
    public function postChangePasswordAction(Request $request): JsonResponse
    {
        $user = new User();
        $form = $this->createForm(ChangePasswordType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $email = $request->request->get('email');
            $password = $form->getData()->getPassword();
            $passwordNew = $this->get('security.password_encoder')
                               ->encodePassword($user, $user->getPassword());
            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class)->findOneBy(['email' => $email]);
            $userRepository->setPassword($passwordNew);

            $event = new EmailChangePasswordEvent($userRepository);
            $dispatcher = $this->get('event_dispatcher');
			$dispatcher->dispatch(EmailChangePasswordEvent::NAME, $event);

            $em->persist($userRepository);
            $em->flush();

            return new JsonResponse(['status' => 'ok']);
        }

        throw new HttpException(400, "Invalid data");
    }
}
