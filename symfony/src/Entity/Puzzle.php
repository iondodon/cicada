<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Puzzle
 * @ORM\Entity
 * @ORM\Table(name="puzzle")
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
     * @ORM\ManyToMany(targetEntity="User")
     * @ORM\JoinTable(name="puzzles_users",
     *     joinColumns={@ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $enrolledPlayers;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Team")
     * @ORM\JoinTable(name="puzzles_teams",
     *     joinColumns={@ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="team_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $enrolledTeams;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Stage")
     * @ORM\JoinTable(name="puzzles_stages",
     *     joinColumns={@ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="stage_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $stages;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Tag")
     * @ORM\JoinTable(name="puzzles_tags",
     *     joinColumns={@ORM\JoinColumn(name="puzzle_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="tag_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $tags;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\Column(nullable=false)
     */
    private $createdBy;

    /**
     * @var DateTime
     *
     * @ORM\Column(nullable=false)
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
     * @ORM\Column(nullable=true)
     */
    private $difficultyByStatistics;

    /**
     * @var integer
     *
     * @ORM\Column(nullable=true)
     */
    private $difficultyByCreator;
}
