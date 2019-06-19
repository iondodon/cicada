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
     * @var string
     *
     * @ORM\Column(type="text", nullable=false)
     */
    private $content;

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
     */
    public function setPuzzleParent(Puzzle $puzzleParent): void
    {
        $this->puzzleParent = $puzzleParent;
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
     */
    public function setLevel(int $level): void
    {
        $this->level = $level;
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
     * @return string
     */
    public function getContent(): string
    {
        return $this->content;
    }

    /**
     * @param string $content
     */
    public function setContent(string $content): void
    {
        $this->content = $content;
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
     */
    public function setCode(string $code): void
    {
        $this->code = $code;
    }
}
