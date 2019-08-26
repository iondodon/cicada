<?php

namespace App\Repository;

use App\Entity\Account;
use App\Entity\Team;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\ORMException;
use Symfony\Bridge\Doctrine\RegistryInterface;

class AccountRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Account::class);
    }

    public function acceptTeam($team_id, User $user): bool
    {
        try {
            $em = $this->getEntityManager();
            /** @var ArrayCollection $requestingTeams */
            $requestingTeams = $user->getAccount()->getRequestingTeams();
            /** @var Team $requestingTeam */
            $requestingTeam = $em->getRepository(Team::class)->find($team_id);

            if($requestingTeam && $requestingTeams->contains($requestingTeam)) {
                $account = $user->getAccount();

                $members = $requestingTeam->getMembers();
                $members->add($account);
                $requestingTeam->setMembers($members);
                
                $requestedMembers = $requestingTeam->getRequestedMembers();
                $requestedMembers->removeElement($account);
                $requestingTeam->setRequestedMembers($requestedMembers);

                $em->persist($requestingTeam);
                $em->flush();
            }
        } catch (ORMException $e) {
            return false;
        }

        return true;
    }
}