<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * Stage
 *
 * @ORM\Entity
 * @ORM\Table(name="stages")
 */
class Stage
{
    public function __construct()
    {

    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var Puzzle
     *
     * @ORM\ManyToOne(targetEntity="Puzzle", inversedBy="stages")
     * @ORM\JoinColumn(name="puzzleParent_id", referencedColumnName="id")
     */
    private $puzzleParent;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $level;

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
     * @var string
     *
     * @ORM\Column(type="text", nullable=false)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=false)
     */
    private $code;

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
    public function getPuzzleParent(): Puzzle
    {
        return $this->puzzleParent;
    }

    /**
     * @param Puzzle $puzzleParent
     * @return Stage
     */
    public function setPuzzleParent(Puzzle $puzzleParent): Stage
    {
        $this->puzzleParent = $puzzleParent;

        return $this;
    }

    /**
     * @return int
     */
    public function getLevel(): int
    {
        return $this->level;
    }

    /**
     * @param int $level
     * @return Stage
     */
    public function setLevel(int $level): Stage
    {
        $this->level = $level;

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
     * @return Stage
     */
    public function setCreatedAt(DateTime $createdAt): Stage
    {
        $this->createdAt = $createdAt;

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
     * @return Stage
     */
    public function setUpdatedAt(DateTime $updatedAt): Stage
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
     * @return Stage
     */
    public function setDescription(string $description): Stage
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @param string $code
     * @return Stage
     */
    public function setCode(string $code): Stage
    {
        $this->code = $code;

        return $this;
    }
}
