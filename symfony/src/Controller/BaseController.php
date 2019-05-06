<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class BaseController
 * @package App\Controller
 *
 * @Route("/api", name="api")
 */
class BaseController extends AbstractController
{
    /**
     * @return JsonResponse
     * @Route("/")
     */
    public function index()
    {
        return JsonResponse::create(["ion" => "noi"]);
    }
}