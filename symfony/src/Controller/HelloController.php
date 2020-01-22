<?php

namespace App\Controller;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class HelloController extends AbstractFOSRestController
{
	/**
	 * @Route("/api", name="hello", methods={"GET", "POST"})
     */
    public function indexAction(Request $request, JWTEncoderInterface $jwtEncoder) : JsonResponse
    {

        return new JsonResponse(["name" => "Ion Dodon"]);
    }
}
