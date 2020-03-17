<?php

namespace App\Controller;

use DateInterval;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use App\Entity\User;

class LoginController extends Controller
{
    /**
     * @Route("/api/token", name="token_authentication")
     * @Method("POST")
     * @param Request $request
     * @return Response
     * @throws \Exception
     */
    public function newTokenAction(Request $request): Response
    {
        $user = $this->getDoctrine()->getRepository(User::class)
            ->findOneBy(['username'=> $request->getUser()]);

        if (!$user) {
            throw $this->createNotFoundException();
        }

        $isValid = $this->get('security.password_encoder')
            ->isPasswordValid($user, $request->getPassword());

        if (!$isValid) {
            throw new BadCredentialsException();
        }

        $token = $this->get('lexik_jwt_authentication.encoder')
            ->encode([
                'username' => $user->getUsername(),
                'clientIp' => $request->getClientIp(),
                'userAgent' => $request->headers->get('User-Agent'),
                'exp' => time() + 86400 // 24 hours expiration
            ]);

        $tokenCookie = new Cookie(
            'BEARER',
            $token,
            (new DateTime())->add(new DateInterval('PT' . 86400 . 'S')),
            '/',
            null,
            false,
            true
        );

        $userIdCookie = new Cookie(
          'userId',
          $user->getId(),
          (new DateTime())->add(new DateInterval('PT' . 86400 . 'S')),
            '/',
            null,
            false,
            false
        );

        $usernameCookie = new Cookie(
            'username',
            $user->getUsername(),
            (new DateTime())->add(new DateInterval('PT' . 86400 . 'S')),
            '/',
            null,
            false,
            false
        );

        $response = new Response();
        $response->headers->setCookie($tokenCookie);
        $response->headers->setCookie($usernameCookie);
        $response->headers->setCookie($userIdCookie);

        return $response;
    }
}
