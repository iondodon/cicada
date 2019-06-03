<?php

namespace App\Entity;

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


//    private $puzzlesEnrolledAt;
//
//    private $teamsMemberOf;

    /**
     * @var User
     *
     * @ORM\OneToOne(targetEntity="User", inversedBy="account")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;


    /**
     * @ORM\Column(type="integer")
     */
    private $puzzlesSolvedCount;

    /**
     * @ORM\Column(type="integer")
     */
    private $winsContestCount;




//    /**
//     * @return mixed
//     */
//    public function getTeamsMemberOf()
//    {
//        return $this->teamsMemberOf;
//    }
//
//    /**
//     * @param mixed $teamsMemberOf
//     */
//    public function setTeamsMemberOf($teamsMemberOf): void
//    {
//        $this->teamsMemberOf = $teamsMemberOf;
//    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user): void
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getWinsContestCount()
    {
        return $this->winsContestCount;
    }

    /**
     * @param mixed $winsContestCount
     */
    public function setWinsContestCount($winsContestCount): void
    {
        $this->winsContestCount = $winsContestCount;
    }

    /**
     * @return mixed
     */
    public function getPuzzlesSolvedCount()
    {
        return $this->puzzlesSolvedCount;
    }

    /**
     * @param mixed $puzzlesSolvedCount
     */
    public function setPuzzlesSolvedCount($puzzlesSolvedCount): void
    {
        $this->puzzlesSolvedCount = $puzzlesSolvedCount;
    }

//    /**
//     * @return mixed
//     */
//    public function getPuzzlesEnrolledAt()
//    {
//        return $this->puzzlesEnrolledAt;
//    }
//
//    /**
//     * @param mixed $puzzlesEnrolledAt
//     */
//    public function setPuzzlesEnrolledAt($puzzlesEnrolledAt): void
//    {
//        $this->puzzlesEnrolledAt = $puzzlesEnrolledAt;
//    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }
}
