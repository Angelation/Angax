<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Agregar headers CORS a la respuesta
     */
    private function addCorsHeaders($response, Request $request)
    {
        $origin = $request->headers->get('Origin');
        $allowedOrigin = 'https://angax-frontend.onrender.com';
        
        if ($origin) {
            if (in_array($origin, [
                'http://localhost:5173',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'https://angax-frontend.onrender.com',
                'http://angax-frontend.onrender.com',
            ])) {
                $allowedOrigin = $origin;
            } elseif (str_contains($origin, 'onrender.com')) {
                $allowedOrigin = $origin;
            }
        }
        
        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
    }
    
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|string|email|max:100|unique:users',
                'password' => 'required|string|min:6|confirmed',
                'role' => 'required|in:user,trainer',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'registerDate' => now(),
                'isActive' => true,
            ]);

            return response()->json([
                'user' => [
                    'id' => $user->userID,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
                ],
                'message' => 'Usuario registrado exitosamente',
            ], 201);
        } catch (ValidationException $e) {
            $response = response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
            // Agregar headers CORS manualmente si es necesario
            $this->addCorsHeaders($response, $request);
            return $response;
        } catch (\Exception $e) {
            Log::error('Error al registrar usuario', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request' => $request->all()
            ]);
            
            $response = response()->json([
                'message' => 'Error al registrar usuario: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
            
            // Agregar headers CORS manualmente si es necesario
            $this->addCorsHeaders($response, $request);
            return $response;
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Las credenciales proporcionadas son incorrectas.',
                    'errors' => ['email' => ['Las credenciales proporcionadas son incorrectas.']]
                ], 422);
            }

            return response()->json([
                'user' => [
                    'id' => $user->userID,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
                ],
                'message' => 'Inicio de sesión exitoso',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al iniciar sesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function me(Request $request)
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json(['error' => 'Email requerido'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'user' => [
                'id' => $user->userID,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
            ],
        ]);
    }
}
