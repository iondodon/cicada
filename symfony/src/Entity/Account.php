<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Account
 * @ORM\Entity
 * @ORM\Table(name="accounts")
 */
class Account
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;


    private $puzzlesEnrolledAt;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Team", inversedBy="members")
     * @ORM\JoinTable(name="accounts_teams")
     */
    private $teamsMemberOf;

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
     * @var integer
     *
     * @ORM\Column(type="integer", nullable=false)
     */
    private $winedContestCount;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="PuzzleSession")
     * @ORM\JoinTable(name="accounts_puzzleSessions",
     *      JoinColumns={@ORM\JoinColumn(name="account_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="puzzleSession_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $puzzleSessions;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Puzzle")
     * @ORM\JoinTable(name="accounts_puzzles",
     *      joinColumns={@ORM\JoinColumn(name="account_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="puzzle_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $createdPuzzles;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Team")
     * @ORM\JoinTable(name="accounts_teams",
     *     joinColumns={@ORM\JoinColumn(name="account_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="team_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $createTeams;

    /**
     * @var Collection
     *
     * @ORM\ManyToMany(targetEntity="Contest")
     * @ORM\JoinTable(name="accounts_contests",
     *      joinColumns={@ORM\JoinColumn(name="account_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="contest_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $createdContests;
}
