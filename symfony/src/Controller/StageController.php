<?php

namespace App\Controller;

use App\Entity\Account;
use App\Entity\Puzzle;
use App\Entity\PuzzleSession;
use App\Entity\Stage;
use App\Entity\Team;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use phpDocumentor\Reflection\Types\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class StageController extends AbstractFOSRestController
{
    /**
     * @Route("/api/stage/check-code", name="stage.check-code", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function checkCode(Request $request): JsonResponse
    {
        /** @var PuzzleSession  $session */
        /** @var Stage  $stage */
        /** @var Account $account */
        /** @var Puzzle  $puzzle */

        $account = $this->getUser()->getAccount();
        $body = json_decode($request->getContent(), true);

        $em = $this->getDoctrine()->getManager();
        $session = $em->getRepository(PuzzleSession::class)->find($body['sessionId']);
        $stage = $em->getRepository(Stage::class)->find($body['stageId']);
        $code = $body['code'];

        if(!$stage) {
            return new JsonResponse(['message' => 'No stage found'], 400);
        }
        if(!$session) {
            return new JsonResponse(['message' => 'No session found'], 400);
        }
        if(!$code || $code === '') {
            return new JsonResponse(['message' => 'Code not defined'], 400);
        }

        if($stage->getLevel() !== $session->getCompleteness()) {
            return new JsonResponse(['message' => 'Not the appropriate stage.'], 400);
        }

        /** @var Team $team */
        $enrolledInTeam = false;
        $teams = $account->getTeamsMemberOf();
        foreach ($teams as $team) {
            if($team->getPuzzleSessions()->contains($session)) {
                $enrolledInTeam = true;
                break;
            }
        }

        if(!$enrolledInTeam && !$account->getPuzzleSessions()->contains($session)) {
            return new JsonResponse(['message' => 'This users isn\'t enrolled for this puzzle'], 400);
        }

        if($stage->getCode() !== $code) {
            return new JsonResponse(['message' => 'Invalid'], 200);
        }

        if($session->getCompleteness() + 1 <= $session->getPuzzle()->getStagesCount()) {
            $session->setCompleteness($session->getCompleteness() + 1);
        }
        $em->persist($session);

        if($session->getCompleteness() === $session->getPuzzle()->getStagesCount()) {
            $team = $session->getTeamPlayer();
            if($team) {
                /** @var ArrayCollection $puzzlesSolved */
                $puzzlesSolved = $team->getPuzzlesSolved();
                $puzzlesSolved->add($session->getPuzzle());
                $team->setPuzzlesSolved($puzzlesSolved);
                $em->persist($team);
            } else {
                $puzzlesSolved = $account->getPuzzlesSolved();
                $puzzlesSolved->add($session->getPuzzle());
                $account->setPuzzlesSolved($puzzlesSolved);
                $em->persist($account);
            }
        }

        $em->flush();
        return new JsonResponse(['message' => 'Valid'], 200);
    }
}
