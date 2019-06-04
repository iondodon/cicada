<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PuzzleSession
 * @ORM\Entity
 * @ORM\Table(name="puzzle_session")
 */
class PuzzleSession
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;


}
