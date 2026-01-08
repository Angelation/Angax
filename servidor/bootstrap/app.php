<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(App\Http\Middleware\SimpleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (PostTooLargeException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $response = response()->json([
                    'message' => 'La imagen/archivo es demasiado grande para el límite actual del servidor.',
                ], 413);
                
                // Agregar headers CORS a la respuesta de error
                $origin = $request->headers->get('Origin');
                $allowedOrigin = $origin && str_contains($origin, 'onrender.com') 
                    ? $origin 
                    : ($origin ?: 'https://angax-frontend.onrender.com');
                $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
                $response->headers->set('Access-Control-Allow-Credentials', 'true');
                
                return $response;
            }

            return null;
        });
        
        // Manejar excepciones generales para agregar CORS
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                $response = response()->json([
                    'message' => 'Error interno del servidor',
                    'error' => config('app.debug') ? $e->getMessage() : 'Ha ocurrido un error'
                ], 500);
                
                // Agregar headers CORS a la respuesta de error
                $origin = $request->headers->get('Origin');
                $allowedOrigin = $origin && str_contains($origin, 'onrender.com') 
                    ? $origin 
                    : ($origin ?: 'https://angax-frontend.onrender.com');
                $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
                $response->headers->set('Access-Control-Allow-Credentials', 'true');
                
                return $response;
            }
            
            return null;
        });
    })->create();
