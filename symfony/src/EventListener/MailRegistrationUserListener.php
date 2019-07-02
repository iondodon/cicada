<?php

namespace App\EventListener;

use App\Event\EmailRegistrationUserEvent;
use Swift_Message;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig_Environment;

class MailRegistrationUserListener
{
    protected $twig;
    protected $mailer;

    public function __construct(Twig_Environment $twig, \Swift_Mailer $mailer)
    {
        $this->twig = $twig;
        $this->mailer = $mailer;
    }

    public function onMailRegistrationUserEvent(EmailRegistrationUserEvent $event): void
    {
        $user = $event->getUser();
        $email = $user->getEmail();
        $password = $user->getPassword();
        $fullName = $event->getUser()->getFullName();

        $body = $this->renderTemplate($fullName, $email);

		$message = (new Swift_Message('Registration User Successfully!'))
            ->setFrom($email)
            ->setTo($email)
            ->setBody($body, 'text/html')
        ;

        $this->mailer->send($message);
    }

    protected function renderTemplate($name, $email): string
    {
        try {
            return $this->twig->render(
                'emails/registration.html.twig',
                [
                    'name' => $name,
                    'email' => $email
                ]
            );
        } catch (LoaderError $e) {
        } catch (RuntimeError $e) {
        } catch (SyntaxError $e) {
        }

        return null;
    }
}