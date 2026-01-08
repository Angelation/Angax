<?php

/**
 * Router script for PHP's built-in server.
 *
 * Usage:
 *   php -S 127.0.0.1:8011 router.php
 *
 * This makes Laravel routes (e.g. /api/*) work correctly without Apache/XAMPP.
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$publicPath = __DIR__ . DIRECTORY_SEPARATOR . 'public';

// If the requested resource exists as a real file under /public, serve it directly.
$requestedPath = realpath($publicPath . $uri);
$publicRealPath = realpath($publicPath);

if (
    $uri !== '/' &&
    $requestedPath !== false &&
    $publicRealPath !== false &&
    str_starts_with($requestedPath, $publicRealPath) &&
    is_file($requestedPath)
) {
    return false;
}

require $publicPath . DIRECTORY_SEPARATOR . 'index.php';


