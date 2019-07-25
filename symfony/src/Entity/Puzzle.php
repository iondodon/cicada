<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Puzzle
 * @ORM\Entity
 * @ORM\Table(name="puzzles")
 */
class Puzzle
{
    public function __construct()
    {
        $this->tags = new ArrayCollection();
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
     * @ORM\ManyToMany(targetEntity="Account", mappedBy="puzzlesEnrolledAt")
     */
    private $enrolledPlayers;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Team", inversedBy="puzzlesEnrolledAt")
     * @ORM\JoinTable(name="puzzles_teams")
     */
    private $enrolledTeams;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="Stage", mappedBy="puzzleParent")
     */
    private $stages;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Tag", inversedBy="puzzles")
     * @ORM\JoinTable(name="puzzles_tags")
     */
    private $tags;

    /**
     * @var Account
     *
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="createdPuzzles")
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id")
     */
    private $createdBy;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $createdAt;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @var bool
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $isPrivate;

    /**
     * @var integer
     *
     * @ORM\Column(nullable=false)
     */
    private $stagesCount;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    private $difficultyByStatistics;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    private $difficultyByCreator;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="PuzzleSession", mappedBy="puzzle")
     */
    private $openSessions;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=false)
     */
    private $description;

    /**
     * @return integer
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return Collection
     */
    public function getOpenSessions(): Collection
    {
        return $this->openSessions;
    }

    /**
     * @param Collection $openSessions
     * @return Puzzle
     */
    public function setOpenSessions(Collection $openSessions): Puzzle
    {
        $this->openSessions = $openSessions;

        return $this;
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
     * @return Puzzle
     */
    public function setName(string $name): Puzzle
    {
        $this->name = $name;

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
     * @return Puzzle
     */
    public function setEnrolledPlayers(Collection $enrolledPlayers): Puzzle
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
     * @return Puzzle
     */
    public function setEnrolledTeams(Collection $enrolledTeams): Puzzle
    {
        $this->enrolledTeams = $enrolledTeams;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getStages(): Collection
    {
        return $this->stages;
    }

    /**
     * @param Collection $stages
     * @return Puzzle
     */
    public function setStages(Collection $stages): Puzzle
    {
        $this->stages = $stages;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    /**
     * @param Collection $tags
     * @return Puzzle
     */
    public function setTags(Collection $tags): Puzzle
    {
        $this->tags = $tags;

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
     * @return Puzzle
     */
    public function setCreatedBy(Account $createdBy): Puzzle
    {
        $this->createdBy = $createdBy;

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
     * @return Puzzle
     */
    public function setCreatedAt(DateTime $createdAt): Puzzle
    {
        $this->createdAt = $createdAt;

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
     * @return Puzzle
     */
    public function setIsPrivate(bool $isPrivate): Puzzle
    {
        $this->isPrivate = $isPrivate;

        return $this;
    }

    /**
     * @return int
     */
    public function getStagesCount(): int
    {
        return $this->stagesCount;
    }

    /**
     * @param int $stagesCount
     * @return Puzzle
     */
    public function setStagesCount(int $stagesCount): Puzzle
    {
        $this->stagesCount = $stagesCount;

        return $this;
    }

    /**
     * @return int
     */
    public function getDifficultyByStatistics(): int
    {
        return $this->difficultyByStatistics;
    }

    /**
     * @param int $difficultyByStatistics
     * @return Puzzle
     */
    public function setDifficultyByStatistics(int $difficultyByStatistics): Puzzle
    {
        $this->difficultyByStatistics = $difficultyByStatistics;

        return $this;
    }

    /**
     * @return int
     */
    public function getDifficultyByCreator(): int
    {
        return $this->difficultyByCreator;
    }

    /**
     * @param int $difficultyByCreator
     * @return Puzzle
     */
    public function setDifficultyByCreator(int $difficultyByCreator): Puzzle
    {
        $this->difficultyByCreator = $difficultyByCreator;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getUpdatedAt(): DateTime
    {
        return $this->updatedAt;
    }

    /**
     * @param DateTime $updatedAt
     * @return Puzzle
     */
    public function setUpdatedAt(DateTime $updatedAt): Puzzle
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     * @return Puzzle
     */
    public function setDescription(string $description): Puzzle
    {
        $this->description = $description;

        return $this;
    }
}
