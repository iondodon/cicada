<?php

namespace App\Repository;

use App\Entity\Account;
use App\Entity\Notification;
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

            $requestedMembers = new ArrayCollection();
            foreach ($data['members'] as $username) {
                $member = $em->getRepository(User::class)->findOneBy(['username' => $username]);
                if($member){
                    if($member->getAccount()->getId() === $user->getAccount()->getId()) {
                        $members = new ArrayCollection();
                        $members->add($user->getAccount());
                        $new_team->setMembers($members);
                    } else {
                        /** @var Account $member_account */
                        $member_account = $member->getAccount();
                        $notification = new Notification();
                        $notification->setSourceAccount($user->getAccount());
                        $notification->setDestinationAccount($member_account);
                        $message = $user->getFullName().' wants to add you in the team '.$data['teamName'].'. See Requesting Teams';
                        $notification->setMessage($message);
                        $notification->setType(1);
                        $em->persist($notification);
                        $requestedMembers->add($member_account);
                        $requestingTeams = $member_account->getRequestingTeams();
                        $requestingTeams->add($new_team);
                        $member_account->setRequestingTeams($requestingTeams);
                        $em->persist($member_account);
                    }
                }
            }
            $new_team->setRequestedMembers($requestedMembers);

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

    /**
     * @param $editedTeam
     * @param $loggedUser
     * @param $teamId
     * @return bool
     */
    public function updateTeam($editedTeam, $loggedUser, $teamId): bool
    {
        $em = $this->getEntityManager();

        try {

            $team = $em->getRepository(Team::class)->findOneBy(['id' => $teamId]);
            if ($team) {
                $prevMembers = $team->getMembers();
                foreach ($prevMembers as $prevMember) {
                    $remains = false;
                    foreach ($editedTeam['members'] as $member_username) {
                        /** @var Account $prevMember $user */
                        $user = $em->getRepository(User::class)->findOneBy(['username' => $member_username]);
                        if ($user && $prevMember->getId() === $user->getAccount()->getId()) {
                            $remains = true;
                            break;
                        }
                    }
                    if (!$remains) {
                        /** @var User $loggedUser $notification */
                        $notification = new Notification();
                        $notification->setMessage('You were removed from the team '.$team->getName());
                        $notification->setDestinationAccount($prevMember);
                        $notification->setSourceAccount($loggedUser->getAccount());
                        $notification->setType(2);
                        $em->persist($notification);
                    }
                }
                $members = new ArrayCollection();
                foreach ($editedTeam['members'] as $member_username) {
                    $user = $em->getRepository(User::class)->findOneBy(['username' => $member_username]);
                    if ($user) {
                        $isNew = true;
                        foreach ($prevMembers as $prevMember) {
                            /** @var Account $prevMember */
                            if ($prevMember->getId() === $user->getAccount()->getId()) {
                                $isNew = false;
                                break;
                            }
                        }
                        if ($isNew) {
                            $alreadyRequested = false;

                            foreach ($team->getRequestedMembers() as $requestedMember) {
                                /** @var Account $requestedMember */
                                if($requestedMember->getId() === $user->getAccount()->getId()) {
                                    $alreadyRequested = true;
                                    break;
                                }
                            }

                            if(!$alreadyRequested) {
                                /** @var User $loggedUser $notification */
                                $notification = new Notification();
                                $notification->setMessage(
                                    'You were requested to be a member of the team '.$team->getName()
                                );
                                $notification->setDestinationAccount($user->getAccount());
                                $notification->setSourceAccount($loggedUser->getAccount());
                                $notification->setType(1);
                                $em->persist($notification);
                                /** @var ArrayCollection $requestedMembers */
                                $requestedMembers = $team->getRequestedMembers();
                                $requestedMembers->add($user->getAccount());
                                $team->setRequestedMembers($requestedMembers);
                                /** @var ArrayCollection $requestingTeams */
                                $requestingTeams = $user->getAccount()->getRequestingTeams();
                                $requestingTeams->add($team);
                                $user->getAccount()->setRequestingTeams($requestingTeams);
                            }
                        } else {
                            /** @var Account $user_account */
                            $user_account = $user->getAccount();
                            $members->add($user_account);
                        }
                    }
                }
                $team->setMembers($members);
                $team->setName($editedTeam['teamName']);
                $em->persist($team);
                $em->flush();

                return true;
            }
        } catch (\Exception $exception) {
            return false;
        }

        return false;
    }
}