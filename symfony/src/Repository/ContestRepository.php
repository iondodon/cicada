<?php

namespace App\Repository;

use App\Entity\Contest;
use App\Entity\Puzzle;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class ContestRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Contest::class);
    }

    public function createContestAndSave($data, User $user): bool
    {
        $em = $this->getEntityManager();

        try {
            $contest = new Contest();
            $contest->setName($data['contest_name']);

            $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['name' => $data['puzzle_name']]);
            if($puzzle){
                $contest->setPuzzle($puzzle);
            } else {
                return false;
            }

//            dump($data); die;

            $contest->setKey($data['key']);
            $contest->setCreatedAt(new DateTime);
            $contest->setCreatedBy($user->getAccount());

            $finishesAt = new DateTime();

            $contest->setFinishesAt(new DateTime($data['finishesAt']));


            $contest->setIsPrivate($data['isPrivate']);


        } catch (\Exception $e) {
            return false;
        }
    }

    public function contestExists($data): bool
    {
        $em = $this->getEntityManager();
        $contest = $em->getRepository(Contest::class)->findOneBy(['name' => $data['contest_name']]);

        if($contest){
            return true;
        }

        return false;
    }

    public function puzzleExists($data): bool
    {
        $em = $this->getEntityManager();
        $contest = $em->getRepository(Puzzle::class)->findOneBy(['name' => $data['puzzle_name']]);

        if($contest){
            return true;
        }

        return false;
    }
}
