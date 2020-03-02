<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Team
 * @ORM\Entity
 * @ORM\Table(name="teams")
 */

class Team
{
    public function __construct()
    {
        $this->puzzleSessions = new ArrayCollection();
        $this->members = new ArrayCollection();
        $this->requestedMembers = new ArrayCollection();
        $this->contestsWon = new ArrayCollection();
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(unique=true, nullable=false)
     */
    private $name;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Account", inversedBy="teamsMemberOf")
     * @ORM\JoinTable(name="teams_accounts")
     */
    private $members;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Account", inversedBy="requestingTeams")
     * @ORM\JoinTable(name="accounts_teams")
     */
    private $requestedMembers;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Puzzle")
     * @ORM\JoinTable(name="team_puzzles_solved",
     *      joinColumns={@ORM\JoinColumn(name="account_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="puzzle_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $puzzlesSolved;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Contest", mappedBy="teamWinner")
     */
    private $contestsWon;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="PuzzleSession", mappedBy="teamPlayer")
     */
    private $puzzleSessions;

    /**
     * @var Account
     *
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="createdTeams")
     * @ORM\JoinColumn(name="creator_account_id", referencedColumnName="id")
     */
    private $creator;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Team
     */
    public function setName(string $name): Team
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getMembers(): Collection
    {
        return $this->members;
    }

    /**
     * @param Collection $members
     * @return Team
     */
    public function setMembers(Collection $members): Team
    {
        $this->members = $members;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getRequestedMembers(): Collection
    {
        return $this->requestedMembers;
    }

    /**
     * @param Collection $requestedMembers
     * @return Team
     */
    public function setRequestedMembers(Collection $requestedMembers): Team
    {
        $this->requestedMembers = $requestedMembers;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getPuzzlesSolved(): Collection
    {
        return $this->puzzlesSolved;
    }

    /**
     * @param Collection $puzzlesSolved
     * @return Team
     */
    public function setPuzzlesSolved($puzzlesSolved): Team
    {
        $this->puzzlesSolved = $puzzlesSolved;

        return $this;
    }

    /**
     * @return int
     */
    public function getPuzzlesSolvedCount(): int
    {
        /** @var PuzzleSession  $sess */
        $puzzlesSolved = 0;
        foreach ($this->getPuzzleSessions() as $sess) {
            if($sess->getCompleteness() === $sess->getPuzzle()->getStagesCount()) {
                $puzzlesSolved++;
            }
        }
        return $puzzlesSolved;
    }

    /**
     * @return Collection
     */
    public function getWinedContests(): Collection
    {
        return $this->puzzlesSolved;
    }

    /**
     * @return Collection
     */
    public function getPuzzleSessions(): Collection
    {
        return $this->puzzleSessions;
    }

    /**
     * @param Collection $puzzleSessions
     * @return Team
     */
    public function setPuzzleSessions(Collection $puzzleSessions): Team
    {
        $this->puzzleSessions = $puzzleSessions;

        return $this;
    }

    /**
     * @return Account
     */
    public function getCreator(): Account
    {
        return $this->creator;
    }

    /**
     * @param Account $creator
     * @return Team
     */
    public function setCreator(Account $creator): Team
    {
        $this->creator = $creator;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getContestsWon(): Collection
    {
        return $this->contestsWon;
    }

    /**
     * @param Collection $contestsWon
     * @return Team
     */
    public function setContestsWon(Collection $contestsWon): Team
    {
        $this->contestsWon = $contestsWon;

        return $this;
    }

    /**
     * @return int
     */
    public function getWinedContestsCount(): int
    {
        return count($this->contestsWon);
    }
}
