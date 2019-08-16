<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Account
 * @ORM\Entity
 * @ORM\Table(name="accounts")
 */
class Account
{
    public function __construct()
    {
        $this->puzzlesEnrolledAt = new ArrayCollection();
        $this->puzzleSessions = new ArrayCollection();
        $this->createdPuzzles = new ArrayCollection();
        $this->createdTeams = new ArrayCollection();
        $this->createdContests = new ArrayCollection();
        $this->contestsEnrolledAt = new ArrayCollection();
        $this->teamsMemberOf = new ArrayCollection();
        $this->notificationsSent = new ArrayCollection();
        $this->notificationsReceived = new ArrayCollection();
        $this->requestingTeams = new ArrayCollection();
    }

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
     * @ORM\OneToMany(targetEntity="PuzzleSession", mappedBy="singlePlayer")
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
     * @ORM\ManyToMany(targetEntity="Team", mappedBy="members")
     */
    private $teamsMemberOf;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Notification", mappedBy="sourceAccount")
     */
    private $notificationsSent;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Notification", mappedBy="destinationAccount")
     */
    private $notificationsReceived;

    /**
     * @var Collection
     *
     * @@ORM\ManyToMany(targetEntity="Team", mappedBy="requestedMembers")
     */
    private $requestingTeams;

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
     * @return Account
     */
    public function setUser(User $user): Account
    {
        $this->user = $user;

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
     * @return Account
     */
    public function setPuzzlesSolvedCount(int $puzzlesSolvedCount): Account
    {
        $this->puzzlesSolvedCount = $puzzlesSolvedCount;

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
     * @return Account
     */
    public function setPuzzlesEnrolledAt(Collection $puzzlesEnrolledAt): Account
    {
        $this->puzzlesEnrolledAt = $puzzlesEnrolledAt;

        return $this;
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
     * @return Account
     */
    public function setWinedContestCount(int $winedContestCount): Account
    {
        $this->winedContestCount = $winedContestCount;

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
     * @return Account
     */
    public function setPuzzleSessions(Collection $puzzleSessions): Account
    {
        $this->puzzleSessions = $puzzleSessions;

        return $this;
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
     * @return Account
     */
    public function setCreatedPuzzles(Collection $createdPuzzles): Account
    {
        $this->createdPuzzles = $createdPuzzles;

        return $this;
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
     * @return Account
     */
    public function setCreatedTeams(Collection $createdTeams): Account
    {
        $this->createdTeams = $createdTeams;

        return $this;
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
     * @return Account
     */
    public function setCreatedContests(Collection $createdContests): Account
    {
        $this->createdContests = $createdContests;

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
     * @param Contest $contestsEnrolledAt
     * @return Account
     */
    public function setContestsEnrolledAt(Contest $contestsEnrolledAt): Account
    {
        $this->contestsEnrolledAt = $contestsEnrolledAt;

        return $this;
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
     * @return Account
     */
    public function setTeamsMemberOf(Collection $teamsMemberOf): Account
    {
        $this->teamsMemberOf = $teamsMemberOf;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getRequestingTeams(): Collection
    {
        return $this->teamsMemberOf;
    }

    /**
     * @param Collection $requestingTeams
     * @return Account
     */
    public function setRequestingTeams(Collection $requestingTeams): Account
    {
        $this->requestingTeams = $requestingTeams;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getNotificationsSent(): Collection
    {
        return $this->notificationsSent;
    }

    /**
     * @param Collection $notificationsSent
     * @return Account
     */
    public function setNotificationsSent(Collection $notificationsSent): Account
    {
        $this->notificationsSent = $notificationsSent;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getNotificationsReceived(): Collection
    {
        return $this->notificationsReceived;
    }

    /**
     * @param Collection $notificationsReceived
     * @return Account
     */
    public function setNotificationsReceived(Collection $notificationsReceived): Account
    {
        $this->notificationsReceived = $notificationsReceived;

        return $this;
    }
}
