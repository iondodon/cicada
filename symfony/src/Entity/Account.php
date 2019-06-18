<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Account
 * @ORM\Entity
 * @ORM\Table(name="accounts")
 */
class Account
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var User
     *
     * @ORM\OneToOne(targetEntity="User", inversedBy="account")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;


    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $puzzlesSolvedCount;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Puzzle", inversedBy="enrolledPlayers")
     * @ORM\JoinTable(name="accounts_puzzlesEnrolledAt")
     */
    private $puzzlesEnrolledAt;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $winedContestCount;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="PuzzleSession")
     * @ORM\JoinTable(name="accounts_puzzleSessions",
     *      joinColumns={@ORM\JoinColumn(name="account_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="puzzleSession_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $puzzleSessions;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Puzzle", mappedBy="createdBy")
     */
    private $createdPuzzles;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Team", mappedBy="creator")
     */
    private $createdTeams;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Contest", mappedBy="createdBy")
     */
    private $createdContests;

    /**
     * @var Contest
     *
     * @ORM\OneToMany(targetEntity="Contest", mappedBy="enrolledPlayers")
     */
    private $contestsEnrolledAt;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Team", inversedBy="members")
     * @ORM\JoinTable(name="accounts_teams")
     */
    private $teamsMemberOf;


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user): void
    {
        $this->user = $user;
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
     * @return int
     */
    public function getWinedContestCount(): int
    {
        return $this->winedContestCount;
    }

    /**
     * @param int $winedContestCount
     */
    public function setWinedContestCount(int $winedContestCount): void
    {
        $this->winedContestCount = $winedContestCount;
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
     * @return Collection
     */
    public function getCreatedPuzzles(): Collection
    {
        return $this->createdPuzzles;
    }

    /**
     * @param Collection $createdPuzzles
     */
    public function setCreatedPuzzles(Collection $createdPuzzles): void
    {
        $this->createdPuzzles = $createdPuzzles;
    }

    /**
     * @return Collection
     */
    public function getCreatedTeams(): Collection
    {
        return $this->createdTeams;
    }

    /**
     * @param Collection $createdTeams
     */
    public function setCreatedTeams(Collection $createdTeams): void
    {
        $this->createdTeams = $createdTeams;
    }

    /**
     * @return Collection
     */
    public function getCreatedContests(): Collection
    {
        return $this->createdContests;
    }

    /**
     * @param Collection $createdContests
     */
    public function setCreatedContests(Collection $createdContests): void
    {
        $this->createdContests = $createdContests;
    }

    /**
     * @return Contest
     */
    public function getContestsEnrolledAt(): Contest
    {
        return $this->contestsEnrolledAt;
    }

    /**
     * @param Contest $contestsEnrolledAt
     */
    public function setContestsEnrolledAt(Contest $contestsEnrolledAt): void
    {
        $this->contestsEnrolledAt = $contestsEnrolledAt;
    }

    /**
     * @return Collection
     */
    public function getTeamsMemberOf(): Collection
    {
        return $this->teamsMemberOf;
    }

    /**
     * @param Collection $teamsMemberOf
     */
    public function setTeamsMemberOf(Collection $teamsMemberOf): void
    {
        $this->teamsMemberOf = $teamsMemberOf;
    }

}
