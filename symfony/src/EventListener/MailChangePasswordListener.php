<?php

namespace App\EventListener;

use Swift_Mailer;
use Swift_Message;
use App\Event\EmailChangePasswordEvent;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig_Environment;

class MailChangePasswordListener
{
    protected $twig;

    protected $mailer;

    public function __construct(Twig_Environment $twig, Swift_Mailer $mailer)
    {
        $this->twig = $twig;
        $this->mailer = $mailer;
    }

    public function onMailChangePasswordEvent(EmailChangePasswordEvent $event): void
    {
        $user = $event->getUser();
        $name = $user->getFullName();
        $email = $user->getEmail();
        $password = $user->getPassword();

        $body = $this->renderTemplate($name, $password, $email);

        $message = (new Swift_Message('Change Password Successfully!'))
            ->setFrom($email)
            ->setTo($email)
			->setBody($body, 'text/html')
        ;

        $this->mailer->send($message);
    }

    protected function renderTemplate($name, $password, $email): string
    {
        try {
            return $this->twig->render(
                'emails/changePassword.html.twig',
                [
                    'name' => $name,
                ]
            );
        } catch (LoaderError $e) {
        } catch (RuntimeError $e) {
        } catch (SyntaxError $e) {
        }
    }
}
