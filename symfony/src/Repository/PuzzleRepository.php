<?php

namespace App\Repository;

use App\Entity\Puzzle;
use App\Entity\Stage;
use App\Entity\Tag;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Exception;
use Symfony\Bridge\Doctrine\RegistryInterface;

class PuzzleRepository extends ServiceEntityRepository
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
    public function createPuzzleAndSave($data, User $user): bool
    {
        $em = $this->getEntityManager();

        try {
            $puzzle = new Puzzle();
            $puzzle->setName($data['name']);
            $puzzle->setDescription($data['description']);

            $tags = new ArrayCollection();
            foreach ($data['tags'] as $tg) {
                $tag = $em->getRepository(Tag::class)->findOneBy(['tag' => $tg]);
                if (!$tag) {
                    $tag = new Tag();
                    $tag->setTag($tg);
                    $em->persist($tag);
                }
                $tags->add($tag);
            }

            $puzzle->setTags($tags);
            $stages = new ArrayCollection();
            foreach ($data['stages'] as $stg) {
                $stage = new Stage();
                $stage->setCreatedAt(new DateTime());
                $stage->setCode($stg['code']);
                $stage->setDescription($stg['description']);
                $stage->setLevel($stg['level']);
                $stage->setPuzzleParent($puzzle);
                $em->persist($stage);
                $stages->add($stage);
            }

            $puzzle->setStages($stages);
            $puzzle->setIsPrivate($data['isPrivate']);
            $puzzle->setDifficultyByCreator($data['difficultyByCreator']);
            $puzzle->setDifficultyByStatistics($data['difficultyByCreator']);
            $puzzle->setStagesCount($data['stagesCount']);
            $puzzle->setCreatedBy($user->getAccount());
            $puzzle->setCreatedAt(new DateTime());
            $em->persist($puzzle);
            $em->flush();

        } catch (Exception $e) {
            return false;
        }

        return true;
    }
}
