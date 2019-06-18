<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Tag
 *
 * @ORM\Entity
 * @ORM\Table(name="tags")
 */
class Tag
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", nullable=false)
     */
    private $tag;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Puzzle", mappedBy="tags")
     */
    private $puzzles;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @param mixed $tag
     */
    public function setTag($tag): void
    {
        $this->tag = $tag;
    }

    /**
     * @return Collection
     */
    public function getPuzzles(): Collection
    {
        return $this->puzzles;
    }

    /**
     * @param Collection $puzzles
     */
    public function setPuzzles(Collection $puzzles): void
    {
        $this->puzzles = $puzzles;
    }
}
