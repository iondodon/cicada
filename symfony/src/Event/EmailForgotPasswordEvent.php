<?php

namespace App\Event;

use Symfony\Component\EventDispatcher\Event;
use App\Entity\User;

class EmailForgotPasswordEvent extends Event
{
    const NAME = 'forgot.password.event.email_fogot_password_event';

	protected $user;

	public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getUser(): object
    {
        return $this->user;
    }
}
