<?php

namespace App\Security;

use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\CookieTokenExtractor;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\AuthenticationCredentialsNotFoundException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use App\Entity\User;

class JwtAuthenticator extends AbstractGuardAuthenticator
{
    private $em;

    private $jwtEncoder;

    public function __construct(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder)
    {
        $this->em = $em;
        $this->jwtEncoder = $jwtEncoder;
    }

    public function supports(Request $request)
    {
        return $request->cookies->has('BEARER');
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new JsonResponse(['message' => 'Authentication required!'], 401);
    }

    public function getCredentials(Request $request)
    {
        if (!$request->cookies->has('BEARER')) {
            return;
        }

        $extractor = new CookieTokenExtractor('BEARER');

        $token = $extractor->extract($request);

        if (!$token || $this->isHack($token, $request)) {
            return;
        }

        return $token;
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $data = $this->jwtEncoder->decode($credentials);

        if ($data == false) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }

        $username = $data['username'];
        $user = $this->em->getRepository(User::class)
            ->findOneBy(['username' => $username]);

        if (!$user) {
            throw new AuthenticationCredentialsNotFoundException();
        }

        return $user;
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse(['message' => $exception->getMessage()], 401);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        return;
    }

    public function supportsRememberMe()
    {
        return false;
    }

    private function isHack($token, Request $request)
    {
        $data = $this->jwtEncoder->decode($token);

        if ($data == false) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }

        $clientIp = $data['clientIp'];
        $userAgent = $data['userAgent'];

        if($clientIp != $request->getClientIp() || $userAgent != $request->headers->get('User-Agent')) {
            return true;
        }

        return false;
    }
}
