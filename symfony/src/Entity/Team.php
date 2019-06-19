<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Team
 * @ORM\Entity
 * @ORM\Table(name="teams")
 */
class Team
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Account", mappedBy="teamsMemberOf")
     */
    private $members;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $puzzlesSolvedCount;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $winedContestsCount;

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
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id")
     */
    private $creator;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Puzzle", mappedBy="enrolledTeams")
     */
    private $puzzlesEnrolledAt;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Contest", mappedBy="enrolledTeams")
     */
    private $contestsEnrolledAt;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
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
     */
    public function setMembers(Collection $members): void
    {
        $this->members = $members;
    }

    /**
     * @return int
     */
    public function getPuzzlesSolvedCount(): int
    {
        return $this->puzzlesSolvedCount;
    }

    /**
     * @param int $puzzlesSolvedCount
     */
    public function setPuzzlesSolvedCount(int $puzzlesSolvedCount): void
    {
        $this->puzzlesSolvedCount = $puzzlesSolvedCount;
    }

    /**
     * @return int
     */
    public function getWinedContestsCount(): int
    {
        return $this->winedContestsCount;
    }

    /**
     * @param int $winedContestsCount
     */
    public function setWinedContestsCount(int $winedContestsCount): void
    {
        $this->winedContestsCount = $winedContestsCount;
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
     */
    public function setPuzzleSessions(Collection $puzzleSessions): void
    {
        $this->puzzleSessions = $puzzleSessions;
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
     */
    public function setCreator(Account $creator): void
    {
        $this->creator = $creator;
    }

    /**
     * @return Collection
     */
    public function getPuzzlesEnrolledAt(): Collection
    {
        return $this->puzzlesEnrolledAt;
    }

    /**
     * @param Collection $puzzlesEnrolledAt
     */
    public function setPuzzlesEnrolledAt(Collection $puzzlesEnrolledAt): void
    {
        $this->puzzlesEnrolledAt = $puzzlesEnrolledAt;
    }

    /**
     * @return Collection
     */
    public function getContestsEnrolledAt(): Collection
    {
        return $this->contestsEnrolledAt;
    }

    /**
     * @param Collection $contestsEnrolledAt
     */
    public function setContestsEnrolledAt(Collection $contestsEnrolledAt): void
    {
        $this->contestsEnrolledAt = $contestsEnrolledAt;
    }
}
