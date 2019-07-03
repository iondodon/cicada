<?php

namespace App\Event;

use Symfony\Component\EventDispatcher\Event;
use App\Entity\User;

class EmailRegistrationUserEvent extends Event
{
    public const NAME = 'registration.user.event.email_registration_user_event';

	protected $user;

	public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getUser(): User
    {
        return $this->user;
    }
}
