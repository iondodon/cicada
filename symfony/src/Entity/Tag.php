<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
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
    public function __construct()
    {
        $this->puzzles = new ArrayCollection();
    }

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
     * @return Tag
     */
    public function setTag($tag): Tag
    {
        $this->tag = $tag;

        return $this;
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
     * @return Tag
     */
    public function setPuzzles(Collection $puzzles): Tag
    {
        $this->puzzles = $puzzles;

        return $this;
    }
}
