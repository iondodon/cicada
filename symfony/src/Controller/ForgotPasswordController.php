<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Form\ForgotPasswordType;
use App\Entity\User;
use App\Utils\PasswordGenerator;
use App\Event\EmailForgotPasswordEvent;

class ForgotPasswordController extends FOSRestController
{
    /**
     * @Route(path="api/forgotPassword", name="forgot_password")
     * @Method("POST")
     */
    public function postForgotPasswordAction(Request $request): JsonResponse
    {
        $user = new User();
        $passwordGenerator = new PasswordGenerator();
        $form = $this->createForm(ForgotPasswordType::class, $user);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $email = $request->request->get('email');
            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class)->findOneBy(['email' => $email]);
            $generatePassword = $this->get('security.password_encoder')
                                    ->encodePassword($user, $passwordGenerator->generatePassword());
            $userRepository->setPassword($generatePassword);

			$event = new EmailForgotPasswordEvent($userRepository);
            $dispatcher = $this->get('event_dispatcher');
			$dispatcher->dispatch(EmailForgotPasswordEvent::NAME, $event);

			$em->persist($userRepository);
            $em->flush();

            return new JsonResponse(['status' => 'ok']);
        }

        throw new HttpException(400, "Invalid data");
    }
}
