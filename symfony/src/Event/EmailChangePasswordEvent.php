<?php

namespace App\Event;

use Symfony\Component\EventDispatcher\Event;
use App\Entity\User;

class EmailChangePasswordEvent extends Event
{
    const NAME = 'change.password.event.email_change_password_event';

	protected $user;

	public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }
}
