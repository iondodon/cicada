<?php

namespace App\Controller;

use App\Entity\User;
use App\Security\TokenAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;


/**
 * Class RegistrationController
 * @package App\Controller
 */
class RegistrationController extends AbstractController
{

    /**
     * @param TokenAuthenticator $authenticator
     * @param GuardAuthenticatorHandler $guardHandler
     * @param Request $request
     * @param EntityManagerInterface $em
     * @return Response|null
     *
     * @Route("/register", name="register")
     */
    public function register(TokenAuthenticator $authenticator, GuardAuthenticatorHandler $guardHandler, Request $request, EntityManagerInterface $em)
    {

        $user = new User();
        $user->setPassword("pass");
        $user->setUsername("ion");
        $user->setRoles(["ROLE_USER"]);
        $user->setApiToken($this->generateToken($user->getUsername()));

        $em->persist($user);
        $em->flush();

        // after validating the user and saving them to the database
        // authenticate the user and use onAuthenticationSuccess on the authenticator
        return $guardHandler->authenticateUserAndHandleSuccess(
            $user,                // the User object you just created
            $request,
            $authenticator,       // authenticator whose onAuthenticationSuccess you want to use
            'main'     // the name of your firewall in security.yaml
        );
    }

    public function generateToken(string $username)
    {
        try {
            return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=').$username;
        } catch (Exception $e) {

        }
    }
}