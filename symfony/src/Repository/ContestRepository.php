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
            $contest->setName($data['contestName']);

            $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['name' => $data['puzzleName']]);
            if($puzzle){
                /** @var Puzzle $puzzle */
                $contest->setPuzzle($puzzle);
            } else {
                return false;
            }

            if(isset($data['code'])){
                $contest->setCode($data['code']);
            } else {
                $contest->setCode(null);
            }
            $contest->setCreatedAt(new DateTime());
            $contest->setCreatedBy($user->getAccount());

            $contest->setStartsAt(new DateTime($data['startsAt']));
            $contest->setFinishesAt(new DateTime($data['finishesAt']));

            $contest->setIsPrivate($data['isPrivate']);

            $em->persist($contest);
            $em->flush();
        } catch (\Exception $e) {
            echo $e;
            return false;
        }

        return true;
    }

    public function contestExists($data): bool
    {
        $em = $this->getEntityManager();
        $contest = $em->getRepository(Contest::class)->findOneBy(['name' => $data['contestName']]);

        if($contest){
            return true;
        }

        return false;
    }

    public function puzzleExists($data): bool
    {
        $em = $this->getEntityManager();
        $puzzle = $em->getRepository(Puzzle::class)->findOneBy(['name' => $data['puzzleName']]);


        if($puzzle){
            return true;
        }

        return false;
    }
}
