<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Serve files from the "public" disk without requiring `php artisan storage:link`.
// This keeps profile photos / post images working both in XAMPP and with `php -S ... router.php`.
Route::get('/storage/{path}', function (string $path) {
    $path = ltrim($path, '/');
    if ($path === '' || str_contains($path, '..')) {
        abort(404);
    }

    $disk = Storage::disk('public');
    if (!$disk->exists($path)) {
        abort(404);
    }

    // Use a streamed response to avoid "403 Forbidden" issues on some Windows/PHP setups
    // when serving files outside `public/` with `response()->file(...)`.
    $mime = $disk->mimeType($path) ?: 'application/octet-stream';
    $size = $disk->size($path);
    $stream = $disk->readStream($path);

    if ($stream === false) {
        abort(404);
    }

    return response()->stream(function () use ($stream) {
        fpassthru($stream);
        fclose($stream);
    }, 200, [
        'Content-Type' => $mime,
        'Content-Length' => (string) $size,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');
