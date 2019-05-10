<?php

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations as Rest;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class HelloController extends FOSRestController
{
	/**
	 * @Route("/api", name="hello", methods={"GET", "POST"})
     */
    public function indexAction(Request $request, JWTEncoderInterface $jwtEncoder): Response
    {

        dump($this->getUser()); die;
        return new Response("hm");
    }
}
