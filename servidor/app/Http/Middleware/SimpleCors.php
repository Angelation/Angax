<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SimpleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Handle preflight OPTIONS request
        $response = $request->getMethod() === 'OPTIONS'
            ? response('', 204)
            : $next($request);

        // Use headers bag so this works with StreamedResponse too (no ->header() fluent helper there).
        // Permitir múltiples orígenes: desarrollo (Vite), Docker local y Render
        $allowedOrigins = [
            'http://localhost:5173',  // Vite dev server
            'http://localhost:3000',  // Docker frontend local
            'http://127.0.0.1:3000',  // Docker frontend local (alternativo)
            'https://angax-frontend.onrender.com',  // Render frontend
            'http://angax-frontend.onrender.com',   // Render frontend (HTTP)
        ];
        
        $origin = $request->headers->get('Origin');
        
        // Si el origen está en la lista permitida, usarlo; si no, permitir el origen de Render
        if ($origin && in_array($origin, $allowedOrigins)) {
            $allowedOrigin = $origin;
        } elseif ($origin && str_contains($origin, 'onrender.com')) {
            // Permitir cualquier subdominio de Render
            $allowedOrigin = $origin;
        } else {
            // Por defecto, permitir el frontend de Render
            $allowedOrigin = 'https://angax-frontend.onrender.com';
        }
        
        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept, Origin');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
