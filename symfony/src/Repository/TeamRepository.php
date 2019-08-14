<?php

namespace App\Repository;

use App\Entity\Account;
use App\Entity\Puzzle;
use App\Entity\Team;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
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
        $em = $this->getEntityManager();

        try {
            $new_team = new Team();
            $new_team->setName($data['teamName']);

            $accounts = new ArrayCollection();
            foreach ($data['members'] as $username) {
                $member = $em->getRepository(User::class)->findOneBy(['username' => $username]);
                if($member){
                    /** @var Account $member_account */
                    $member_account = $member->getAccount();
                    $new_team->addMember($member_account);
                }
            }
            $new_team->setMembers($accounts);

            $new_team->setPuzzlesSolvedCount(0);
            $new_team->setWinedContestsCount(0);
            $new_team->setCreator($user->getAccount());

            $em->persist($new_team);
            $em->flush();
        } catch (\Exception $exception) {
            return false;
        }

        return true;
    }
}