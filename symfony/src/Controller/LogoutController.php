<?php

namespace App\Controller;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\Controller\Annotations\Route;

class LogoutController extends AbstractFOSRestController
{
    /**
     * @Route("/api/logout", name="logout", methods={"POST"})
     * @return Response
     * @throws \Exception
     */
    public function logout(): Response
    {
        $response = new Response();
        $response->headers->clearCookie('BEARER');
        $response->headers->clearCookie('userId');
        $response->headers->clearCookie('username');
        $response->setStatusCode(200);
        return $response;
    }
}
