<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findByUsernameOrEmail(string $username): string
    {
        return $this->createQueryBuilder('u')
             ->where('u.username = :username OR u.email = :email')
             ->setParameter('username', $username)
             ->setParameter('email', $username)
             ->getQuery()
             ->getOneOrNullResult();
    }
}
