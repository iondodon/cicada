<?php

namespace App\Controller;

use App\Entity\Account;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Form\UserType;
use App\Entity\User;
use App\Event\EmailRegistrationUserEvent;

class RegistrationController extends FOSRestController
{
    /**
     * @Route(path="/api/register", name="registration", methods={"POST"})
     * @param Request $request
     *
     * @return Response
     */
    public function postRegisterAction(Request $request): Response
    {
        $username = $request->request->get('username');
        $email = $request->request->get('email');
        $captcha = $request->request->get('captchaToken');

        ///////////////////////////////////////////////////////////////////

        if(!$captcha){
            throw new HttpException(Response::HTTP_FORBIDDEN, 'Invalid captcha.');
        }

        $secretKey = "6Leb8-QUAAAAAIkl4RpKD4-zwajSrNJfInJobVJk";
        $ip = $_SERVER['REMOTE_ADDR'];

        // post request to server
        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = array('secret' => $secretKey, 'response' => $captcha, 'remoteip' => $ip);


        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            )
        );

        $context  = stream_context_create($options);
        $response = file_get_contents($url, false, $context);
        $responseKeys = json_decode($response,true);
        header('Content-type: application/json');

        if(!$responseKeys["success"]) {
            $response = new Response();
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            $response->setContent(json_encode($responseKeys));
            return $response;
        }

        ///////////////////////////////////////////////////////////////////

        $em  = $this->getDoctrine()->getManager();

        $user =  $em->getRepository(User::class)->findBy(
            array('email' => $email)
        );
        if($user){
            throw new HttpException(Response::HTTP_FORBIDDEN, 'Email taken.');
        }

        $user =  $em->getRepository(User::class)->findBy(
            array('username' => $username)
        );
        if($user){
            throw new HttpException(Response::HTTP_FORBIDDEN, 'Username taken.');
        }

        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $password = $this->get('security.password_encoder')->encodePassword($user, $user->getPassword());
            $user->setPassword($password);
            $user->setRoles(['ROLE_USER']);

            $account = new Account();
            $account->setUser($user);
            $em->persist($account);

            $user->setAccount($account);

            $event = new EmailRegistrationUserEvent($user);
            $dispatcher = $this->get('event_dispatcher');
            $dispatcher->dispatch(EmailRegistrationUserEvent::NAME, $event);

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            $response = new Response();
            $response->setStatusCode(Response::HTTP_CREATED);
            return $response;
        }

        throw new HttpException(400, 'Invalid data');
    }
}
