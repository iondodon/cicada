<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * User
 *
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $fullName;

    /**
     * @ORM\Column(type="string")
     */
    private $surname;

    /**
     * @ORM\Column(type="string")
     */
    private $username;

    /**
     * @ORM\Column(type="string")
     */
    private $email;

    /**
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @var Account
     * @ORM\OneToOne(targetEntity="Account", mappedBy="user")
     */
    private $account;

    /**
     * @var array
     *
     * @ORM\ManyToMany(targetEntity="Team")
     * @ORM\JoinTable(name="users_teams",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="team_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $teams;

    /**
     * @return mixed
     */
    public function getTeams()
    {
        return $this->teams;
    }

    /**
     * @param mixed $teams
     */
    public function setTeams($teams): void
    {
        $this->teams = $teams;
    }

    /**
     * @return mixed
     */
    public function getAccount()
    {
        return $this->account;
    }

    /**
     * @param mixed $account
     */
    public function setAccount($account): void
    {
        $this->account = $account;
    }

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

	public function getId(): int
	{
		return $this->id;
	}

	public function setFullName(string $fullName): void
	{
		$this->fullName = $fullName;
	}

	public function getFullName(): ?string
	{
		return $this->fullName;
	}

	public function setSurname(string $surname): void
	{
		$this->surname = $surname;
	}

	public function getSurname(): ?string
	{
		return $this->surname;
	}

	public function setUsername(string $username): void
	{
		$this->username = $username;
	}

	public function getUsername(): ?string
	{
		return $this->username;
	}

	public function setEmail(string $email): void
	{
		$this->email = $email;
	}

	public function getEmail(): ?string
	{
		return $this->email;
	}

	public function setPassword(string $password): void
	{
		$this->password = $password;
	}

	public function getPassword(): ?string
	{
		return $this->password;
	}

	public function getRoles(): array
	{
		$roles = $this->roles;

		if (empty($roles)) {
			$roles[] = 'ROLE_USER';
		}

		return array_unique($roles);
	}

	public function setRoles(array $roles): void
	{
		$this->roles = $roles;
	}

	public function getSalt(): ?string
	{
		return null;
	}

	public function eraseCredentials(): void
	{

	}
}
