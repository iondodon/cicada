<?php

namespace App\EventListener;

use App\Event\EmailForgotPasswordEvent;
use App\Utils\PasswordGenerator;
use Swift_Mailer;
use Swift_Message;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\User\UserInterface;
use Twig_Environment;

class MailForgotPasswordListener
{
    protected $twig;
    private $passwordEncoder;
    protected $mailer;

    public function __construct(Twig_Environment $twig, Swift_Mailer $mailer, UserPasswordEncoder $passwordEncoder)
    {
        $this->twig = $twig;
        $this->mailer = $mailer;
        $this->passwordEncoder = $passwordEncoder;
    }

    public function onMailForgotPasswordEvent(EmailForgotPasswordEvent $event): void
    {
        $user = $event->getUser();
        $name = $user->getName();
        $email = $user->getEmail();

        $passwordGenerator = new PasswordGenerator();
        $plain_password = $passwordGenerator->generatePassword();
        /** @var UserInterface $user */
        $password = $this->passwordEncoder->encodePassword($user, $plain_password);
        $user->setPassword($password);


        $body = $this->renderTemplate($name, $plain_password, $email);

        $message = (new Swift_Message('Request Reset Password Successfully!'))
            ->setFrom($email)
            ->setTo($email)
            ->setBody($body, 'text/html')
        ;

        $this->mailer->send($message);
    }

    protected function renderTemplate($name, $password, $email): string
    {
		return $this->twig->render(
            'emails/forgotPassword.html.twig',
            [
                'name' => $name,
                'password' => $password,
                'email' => $email
            ]
        );
    }
}
