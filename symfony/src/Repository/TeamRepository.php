<?php

namespace App\Repository;

use App\Entity\Puzzle;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class TeamRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Puzzle::class);
    }

    /**
     * @param $data
     * @param User $user
     * @return bool
     */
    public function createTeamAndSave($data, User $user): bool
    {
        dump($data); die;

        return true;
    }
}
