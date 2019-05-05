<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function indexAction(){

        return new JsonResponse(["ion" => "noi"]);
    }
}