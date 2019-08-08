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
        $this->contestsEnrolledAt = new ArrayCollection();
        $this->puzzleSessions = new ArrayCollection();
        $this->puzzlesEnrolledAt = new ArrayCollection();
        $this->members = new ArrayCollection();
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
     * @ORM\JoinColumn(name="creator_account_id", referencedColumnName="id")
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
     * @return int
     */
    public function getPuzzlesSolvedCount(): int
    {
        return $this->puzzlesSolvedCount;
    }

    /**
     * @param int $puzzlesSolvedCount
     * @return Team
     */
    public function setPuzzlesSolvedCount(int $puzzlesSolvedCount): Team
    {
        $this->puzzlesSolvedCount = $puzzlesSolvedCount;

        return $this;
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
     * @return Team
     */
    public function setWinedContestsCount(int $winedContestsCount): Team
    {
        $this->winedContestsCount = $winedContestsCount;

        return $this;
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
    public function getPuzzlesEnrolledAt(): Collection
    {
        return $this->puzzlesEnrolledAt;
    }

    /**
     * @param Collection $puzzlesEnrolledAt
     * @return Team
     */
    public function setPuzzlesEnrolledAt(Collection $puzzlesEnrolledAt): Team
    {
        $this->puzzlesEnrolledAt = $puzzlesEnrolledAt;

        return $this;
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
     * @return Team
     */
    public function setContestsEnrolledAt(Collection $contestsEnrolledAt): Team
    {
        $this->contestsEnrolledAt = $contestsEnrolledAt;

        return $this;
    }
}
