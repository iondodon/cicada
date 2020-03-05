<?php

namespace App\Controller;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\ResultSetMapping;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class CommonController extends AbstractFOSRestController
{
    /**
     * @Route("/api/get-top-players", name="contests.get-top-players", methods={"GET"})
     * @param EntityManagerInterface $em
     * @return JsonResponse
     */
    public function getTopPlayers(EntityManagerInterface $em) : JsonResponse
    {
        $query = $em->createQuery(/** @lang DQL */ '
            SELECT acc as account, COUNT(acc) AS solved
            FROM App\Entity\Account acc
                JOIN App\Entity\PuzzleSession sess
                JOIN App\Entity\Puzzle puzz
            WHERE sess.puzzle = puzz AND sess.singlePlayer = acc
                AND sess.completeness = puzz.stagesCount
            GROUP BY account
            ORDER BY solved DESC
        ')->setMaxResults(10);

        $result = $query->getResult();

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        $resultJson = $serializer->serialize($result, 'json', [
            'attributes' => [
                'id',
                'user' => ['fullName']
            ]
        ]);

        return new JsonResponse(json_decode($resultJson, true), 200);
    }
}
