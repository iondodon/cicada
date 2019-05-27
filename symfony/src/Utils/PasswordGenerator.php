<?php

namespace App\Utils;

use Exception;

class PasswordGenerator implements PasswordGeneratorInterface
{
    public function generatePassword()
    {
        try {
            return bin2hex(random_bytes(5));
        } catch (Exception $e) {}

        return "123456789";
    }
}
