<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
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
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function postChangePasswordAction(Request $request): JsonResponse
    {
        $form = $this->createForm(ChangePasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $email = $request->request->get('email');
            $old_plain_password = $request->request->get('old_password');
            $new_plain_password = $request->request->get('new_password');


            $user = $this->getDoctrine()->getRepository(User::class)
                ->findOneBy(['email'=> $email]);

            if (!$user) {
                throw $this->createNotFoundException();
            }

            $isValid = $this->get('security.password_encoder')
                ->isPasswordValid($user, $old_plain_password);

            if(!$isValid) {
                throw $this->createAccessDeniedException();
            }

            $passwordNew = $this->get('security.password_encoder')
                               ->encodePassword($user, $new_plain_password);

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class)->findOneBy(['email' => $email]);
            $userRepository->setPassword($passwordNew);

            /** @var User $userRepository */
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
