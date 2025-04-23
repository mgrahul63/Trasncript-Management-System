 

<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Token
{
    /**
     * Sign - Static method to generate a JWT token
     * 
     * @param array $payload - The data you want to include in the token
     * @param string $key - The signature key
     * @param int|null $expire - (optional) Expiration time in seconds
     * 
     * @return string token
     */
    public static function Sign(array $payload, string $key, int $expire = null): string
    {
        // Add expiration time to the payload if provided
        if ($expire) {
            $payload['exp'] = time() + $expire;
        }

        // Generate token using JWT::encode
        return JWT::encode($payload, $key, 'HS256');
    }

    /**
     * Verify - Static method to verify token
     * 
     * @param string $token - The JWT token to verify
     * @param string $key - The signature key
     * 
     * @return mixed - false if token is invalid or expired, payload array if valid
     */
    public static function Verify(string $token, string $key)
    {
        try {
            // Decode token using JWT::decode
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            // Convert decoded object to array
            return (array) $decoded;
        } catch (Exception $e) {
            // If token is invalid or expired, return false
            return false;
        }
    }
}
