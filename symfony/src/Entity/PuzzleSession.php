<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PuzzleSession
 * @ORM\Entity
 * @ORM\Table(name="puzzleSessions")
 */
class PuzzleSession
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var Account
     *
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="puzzleSessions")
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id")
     */
    private $singlePlayer;

    /**
     * @var Team
     *
     * @ORM\ManyToOne(targetEntity="Team", inversedBy="puzzleSessions")
     * @ORM\JoinColumn(name="team_id", referencedColumnName="id")
     */
    private $teamPlayer;

    /**
     * @var Puzzle
     *
     * @ORM\ManyToOne(targetEntity="Puzzle", inversedBy="openSessions")
     * @ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")
     */
    private $puzzle;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $completeness;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return Account
     */
    public function getSinglePlayer(): Account
    {
        return $this->singlePlayer;
    }

    /**
     * @param Account $singlePlayer
     */
    public function setSinglePlayer(Account $singlePlayer): void
    {
        $this->singlePlayer = $singlePlayer;
    }

    /**
     * @return Team
     */
    public function getTeamPlayer(): Team
    {
        return $this->teamPlayer;
    }

    /**
     * @param Team $teamPlayer
     */
    public function setTeamPlayer(Team $teamPlayer): void
    {
        $this->teamPlayer = $teamPlayer;
    }

    /**
     * @return Puzzle
     */
    public function getPuzzle(): Puzzle
    {
        return $this->puzzle;
    }

    /**
     * @param Puzzle $puzzle
     */
    public function setPuzzle(Puzzle $puzzle): void
    {
        $this->puzzle = $puzzle;
    }

    /**
     * @return int
     */
    public function getCompleteness(): int
    {
        return $this->completeness;
    }

    /**
     * @param int $completeness
     */
    public function setCompleteness(int $completeness): void
    {
        $this->completeness = $completeness;
    }
}
