<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
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
    public function __construct()
    {
        $this->enrolledTeams = new ArrayCollection();
        $this->enrolledPlayers = new ArrayCollection();
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
     * @var Puzzle
     *
     * @ORM\OneToOne(targetEntity="Puzzle")
     * @ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")
     * )
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
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id", nullable=false)
     */
    private $createdBy;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $finishesAt;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $startsAt;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=true)
     */
    private $code;

    /**
     * @var boolean
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $isPrivate;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Account", mappedBy="contestsEnrolledAt")
     */
    private $enrolledPlayers;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Team", mappedBy="contestsEnrolledAt")
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
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Contest
     */
    public function setName(string $name): Contest
    {
        $this->name = $name;

        return $this;
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
     * @return Contest
     */
    public function setPuzzle(Puzzle $puzzle): Contest
    {
        $this->puzzle = $puzzle;

        return $this;
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
     * @return Contest
     */
    public function setCreatedAt(DateTime $createdAt): Contest
    {
        $this->createdAt = $createdAt;

        return $this;
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
     * @return Contest
     */
    public function setCreatedBy(Account $createdBy): Contest
    {
        $this->createdBy = $createdBy;

        return $this;
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
     * @return Contest
     */
    public function setFinishesAt(DateTime $finishesAt): Contest
    {
        $this->finishesAt = $finishesAt;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getStartsAt(): DateTime
    {
        return $this->startsAt;
    }

    /**
     * @param DateTime $startsAt
     * @return Contest
     */
    public function setStartsAt(DateTime $startsAt): Contest
    {
        $this->startsAt = $startsAt;

        return $this;
    }

    /**
     * @return string
     */
    public function getCode(): ?string
    {
        return $this->code;
    }

    /**
     * @param string $code
     * @return Contest
     */
    public function setCode(?string $code): Contest
    {
        $this->code = $code;

        return $this;
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
     * @return Contest
     */
    public function setIsPrivate(bool $isPrivate): Contest
    {
        $this->isPrivate = $isPrivate;

        return $this;
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
     * @return Contest
     */
    public function setEnrolledPlayers(Collection $enrolledPlayers): Contest
    {
        $this->enrolledPlayers = $enrolledPlayers;

        return $this;
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
     * @return Contest
     */
    public function setEnrolledTeams(Collection $enrolledTeams): Contest
    {
        $this->enrolledTeams = $enrolledTeams;

        return $this;
    }
}
