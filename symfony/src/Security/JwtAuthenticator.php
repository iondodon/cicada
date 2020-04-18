<?php

namespace App\Security;

use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\CookieTokenExtractor;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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

    /**
     * JwtAuthenticator constructor.
     * @param EntityManagerInterface $em
     * @param JWTEncoderInterface $jwtEncoder
     */
    public function __construct(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder)
    {
        $this->em = $em;
        $this->jwtEncoder = $jwtEncoder;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request) : bool
    {
        return $request->cookies->has('BEARER');
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return JsonResponse|Response
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new JsonResponse(['message' => 'Authentication required!'], 401);
    }

    /**
     * @param Request $request
     * @return false|mixed|string|void
     * @throws JWTDecodeFailureException
     */
    public function getCredentials(Request $request)
    {
        if (!$request->cookies->has('BEARER')) {
            return false;
        }

        $extractor = new CookieTokenExtractor('BEARER');

        $token = $extractor->extract($request);

        if (!$token) {
            return false;
        }

        if(!$token) {
            return false;
        }

        return $token;
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return object|UserInterface|null
     * @throws JWTDecodeFailureException
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $data = $this->jwtEncoder->decode($credentials);

        if ($data === false) {
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

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user) : bool
    {
        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse|Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse(['message' => $exception->getMessage()], 401);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return Response|void|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        return;
    }

    /**
     * @return bool
     */
    public function supportsRememberMe() : bool
    {
        return false;
    }

    /**
     * @param $token
     * @param Request $request
     * @return bool
     * @throws JWTDecodeFailureException
     */
    private function isHack($token, Request $request) : bool
    {
        $data = $this->jwtEncoder->decode($token);

        if ($data === false) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }

        if($data['clientIp'] !== $request->getClientIp()) {
            return true;
        }

        if($data['userAgent'] !== $request->headers->get('User-Agent')) {
            return true;
        }

        return false;
    }
}
