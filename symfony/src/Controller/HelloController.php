<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class HelloController extends FOSRestController
{
	/**
	 * @Route("/api", name="hello", methods={"GET", "POST"})
     */
    public function indexAction(Request $request, JWTEncoderInterface $jwtEncoder) : JsonResponse
    {
        return new JsonResponse([
            "name" => "ion",
            "mhm" => ["aaa", "addaaa"]
        ]);
    }
}
