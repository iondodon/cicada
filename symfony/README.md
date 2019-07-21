# Symfony4APIBoilerplateJWT

[![Build Status](https://travis-ci.org/Tony133/Symfony4APIBoilerplateJWT.svg?branch=master)](https://travis-ci.org/Tony133/Symfony4APIBoilerplateJWT)

An API Boilerplate to create a ready-to-use REST API in seconds with Symfony 4.2

## Install with Composer

```
    $ composer create-project tony133/symfony4-api-boilerplate-jwt myProject
```

## Setting Environment

```
    $ cp .env.dist .env
```

## Generate the SSH keys

```
	$ mkdir config/jwt
	$ openssl genrsa -out config/jwt/private.pem -aes256 4096
	$ openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

## Generate Token Authentication with Curl

```
	$ curl -H 'content-type: application/json' -v -X  POST http://127.0.0.1:8000/api/token -H 'Authorization:Basic username:password'
```

## Getting phpunit

```
    $ php bin/phpunit or ./bin/phpunit
```

## Example with Symfony4APIBoilerplateJWT

* [How to Build an API-Only JWT Symfony App](https://github.com/Tony133/Symfony4APIBoilerplateJWTBook)

