<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Contest
 *
 * @ORM\Entity
 * @ORM\Table(name="contests")
 */
class Contest
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var Puzzle
     *
     * @ORM\OneToOne(targetEntity="Puzzle")
     * @ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")
     */
    private $puzzle;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * @var Account
     *
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="createdContests")
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id")
     */
    private $createdBy;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $finishesAt;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    private $key;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $isPrivate;

    /**
     * @var Collection
     *
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="contestsEnrolledAt")
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id")
     */
    private $enrolledPlayers;

    /**
     * @var Collection
     *
     * @ORM\ManyToOne(targetEntity="Team", inversedBy="contestsEnrolledAt")
     * @ORM\JoinColumn(name="team_id", referencedColumnName="id")
     */
    private $enrolledTeams;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
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
     * @return DateTime
     */
    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param DateTime $createdAt
     */
    public function setCreatedAt(DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @return Account
     */
    public function getCreatedBy(): Account
    {
        return $this->createdBy;
    }

    /**
     * @param Account $createdBy
     */
    public function setCreatedBy(Account $createdBy): void
    {
        $this->createdBy = $createdBy;
    }

    /**
     * @return DateTime
     */
    public function getFinishesAt(): DateTime
    {
        return $this->finishesAt;
    }

    /**
     * @param DateTime $finishesAt
     */
    public function setFinishesAt(DateTime $finishesAt): void
    {
        $this->finishesAt = $finishesAt;
    }

    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }

    /**
     * @param string $key
     */
    public function setKey(string $key): void
    {
        $this->key = $key;
    }

    /**
     * @return bool
     */
    public function isPrivate(): bool
    {
        return $this->isPrivate;
    }

    /**
     * @param bool $isPrivate
     */
    public function setIsPrivate(bool $isPrivate): void
    {
        $this->isPrivate = $isPrivate;
    }

    /**
     * @return Collection
     */
    public function getEnrolledPlayers(): Collection
    {
        return $this->enrolledPlayers;
    }

    /**
     * @param Collection $enrolledPlayers
     */
    public function setEnrolledPlayers(Collection $enrolledPlayers): void
    {
        $this->enrolledPlayers = $enrolledPlayers;
    }

    /**
     * @return Collection
     */
    public function getEnrolledTeams(): Collection
    {
        return $this->enrolledTeams;
    }

    /**
     * @param Collection $enrolledTeams
     */
    public function setEnrolledTeams(Collection $enrolledTeams): void
    {
        $this->enrolledTeams = $enrolledTeams;
    }
}
