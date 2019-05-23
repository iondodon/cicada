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

class LogoutController extends Controller
{
    /**
     * @Route("/api/logout", name="logout")
     * @Method("POST")
     * @param Request $request
     * @return Response
     * @throws \Exception
     */
    public function newTokenAction(Request $request): Response
    {
        $response = new Response();
        $response->headers->clearCookie('BEARER');
        return $response;
    }
}
