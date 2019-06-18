<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Puzzle
 * @ORM\Entity
 * @ORM\Table(name="puzzles")
 */
class Puzzle
{
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
     * @ORM\ManyToMany(targetEntity="Stage", mappedBy="puzzleParent")
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
     * @var boolean
     *
     * @ORM\Column(nullable=false)
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
     */
    public function setName(string $name): void
    {
        $this->name = $name;
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

    /**
     * @return Collection
     */
    public function getStages(): Collection
    {
        return $this->stages;
    }

    /**
     * @param Collection $stages
     */
    public function setStages(Collection $stages): void
    {
        $this->stages = $stages;
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
     */
    public function setTags(Collection $tags): void
    {
        $this->tags = $tags;
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
     * @return int
     */
    public function getStagesCount(): int
    {
        return $this->stagesCount;
    }

    /**
     * @param int $stagesCount
     */
    public function setStagesCount(int $stagesCount): void
    {
        $this->stagesCount = $stagesCount;
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
     */
    public function setDifficultyByStatistics(int $difficultyByStatistics): void
    {
        $this->difficultyByStatistics = $difficultyByStatistics;
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
     */
    public function setDifficultyByCreator(int $difficultyByCreator): void
    {
        $this->difficultyByCreator = $difficultyByCreator;
    }
}
