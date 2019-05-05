<?php

namespace App\Controller;

use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LuckyController
{
    /**
     * @param $max
     * @Route("/lucky/number/{max}", name="app_lucky_number")
     * @return Response
     * @throws Exception
     */
    public function number($max){
        $number = random_int(0, $max);

        return new Response(
            '<html lang="html"><body>Lucky number:'.$number.' </body></html>'
        );
    }
}