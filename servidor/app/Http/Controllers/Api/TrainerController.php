<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Routine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrainerController extends Controller
{
    public function getClients(Request $request)
    {
        try {
            $trainerEmail = $request->query('trainer_email');
            if (!$trainerEmail) {
                return response()->json(['message' => 'Email de entrenador requerido'], 400);
            }

            $trainer = User::where('email', $trainerEmail)->where('role', 'trainer')->first();
            if (!$trainer) {
                return response()->json(['message' => 'Entrenador no encontrado'], 404);
            }

            $clients = $trainer->clients()
                ->where('trainers_clients.isActive', true)
                ->select('users.userID', 'users.name', 'users.email', 'users.profilePhoto')
                ->get()
                ->map(function ($client) {
                    return [
                        'userID' => $client->userID,
                        'name' => $client->name,
                        'email' => $client->email,
                        'photo' => $client->profilePhoto ? asset('storage/' . $client->profilePhoto) : null,
                    ];
                });

            return response()->json([
                'clients' => $clients,
                'count' => $clients->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener clientes: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener clientes'], 500);
        }
    }

    public function getAvailableUsers(Request $request)
    {
        try {
            $trainerEmail = $request->query('trainer_email');
            if (!$trainerEmail) {
                return response()->json(['message' => 'Email de entrenador requerido'], 400);
            }

            $trainer = User::where('email', $trainerEmail)->where('role', 'trainer')->first();
            if (!$trainer) {
                return response()->json(['message' => 'Entrenador no encontrado'], 404);
            }

            // Obtener IDs de clientes actuales
            $currentClientIds = $trainer->clients()
                ->where('trainers_clients.isActive', true)
                ->pluck('users.userID')
                ->toArray();

            // Obtener usuarios que no son entrenadores, no son el mismo entrenador, y no son clientes actuales
            $availableUsers = User::where('role', 'user')
                ->where('isActive', true)
                ->where('userID', '!=', $trainer->userID)
                ->whereNotIn('userID', $currentClientIds)
                ->select('userID', 'name', 'email', 'profilePhoto')
                ->get()
                ->map(function ($user) {
                    return [
                        'userID' => $user->userID,
                        'name' => $user->name,
                        'email' => $user->email,
                        'photo' => $user->profilePhoto ? asset('storage/' . $user->profilePhoto) : null,
                    ];
                });

            return response()->json([
                'users' => $availableUsers,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener usuarios disponibles: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener usuarios disponibles'], 500);
        }
    }

    public function addClient(Request $request)
    {
        try {
            $request->validate([
                'trainer_email' => 'required|email',
                'client_email' => 'required|email',
            ]);

            $trainer = User::where('email', $request->trainer_email)->where('role', 'trainer')->first();
            if (!$trainer) {
                return response()->json(['message' => 'Entrenador no encontrado'], 404);
            }

            $client = User::where('email', $request->client_email)->where('role', 'user')->first();
            if (!$client) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Verificar si el cliente ya tiene un entrenador
            $existingTrainer = DB::table('trainers_clients')
                ->where('clientID', $client->userID)
                ->where('isActive', true)
                ->first();

            if ($existingTrainer && $existingTrainer->trainerID !== $trainer->userID) {
                return response()->json(['message' => 'Este usuario ya tiene un entrenador asignado'], 400);
            }

            // Verificar límite de 5 clientes
            $currentClientsCount = DB::table('trainers_clients')
                ->where('trainerID', $trainer->userID)
                ->where('isActive', true)
                ->count();

            if ($currentClientsCount >= 5) {
                return response()->json(['message' => 'Has alcanzado el máximo de 5 clientes'], 400);
            }

            // Verificar si ya existe la relación (inactiva)
            $existingRelation = DB::table('trainers_clients')
                ->where('trainerID', $trainer->userID)
                ->where('clientID', $client->userID)
                ->first();

            if ($existingRelation) {
                // Reactivar la relación
                DB::table('trainers_clients')
                    ->where('trainerID', $trainer->userID)
                    ->where('clientID', $client->userID)
                    ->update([
                        'isActive' => true,
                        'updated_at' => now(),
                    ]);
            } else {
                // Crear nueva relación
                DB::table('trainers_clients')->insert([
                    'trainerID' => $trainer->userID,
                    'clientID' => $client->userID,
                    'isActive' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Cliente agregado exitosamente',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al agregar cliente: ' . $e->getMessage());
            return response()->json(['message' => 'Error al agregar cliente'], 500);
        }
    }

    public function removeClient(Request $request)
    {
        try {
            $request->validate([
                'trainer_email' => 'required|email',
                'client_email' => 'required|email',
            ]);

            $trainer = User::where('email', $request->trainer_email)->where('role', 'trainer')->first();
            if (!$trainer) {
                return response()->json(['message' => 'Entrenador no encontrado'], 404);
            }

            $client = User::where('email', $request->client_email)->where('role', 'user')->first();
            if (!$client) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Desactivar la relación en lugar de eliminarla
            $updated = DB::table('trainers_clients')
                ->where('trainerID', $trainer->userID)
                ->where('clientID', $client->userID)
                ->update([
                    'isActive' => false,
                    'updated_at' => now(),
                ]);

            if ($updated === 0) {
                return response()->json(['message' => 'Relación no encontrada'], 404);
            }

            return response()->json([
                'message' => 'Cliente eliminado exitosamente',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al eliminar cliente: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar cliente'], 500);
        }
    }

    public function getAvailableTrainers(Request $request)
    {
        try {
            $userEmail = $request->query('user_email');
            $user = null;
            
            if ($userEmail) {
                $user = User::where('email', $userEmail)->where('role', 'user')->first();
            }

            // Obtener entrenadores activos con menos de 5 estudiantes
            // Primero obtenemos todos los entrenadores activos
            $trainers = User::where('role', 'trainer')
                ->where('isActive', true)
                ->select('userID', 'name', 'email', 'profilePhoto', 'bio')
                ->get();

            // Filtrar entrenadores con menos de 5 estudiantes
            $availableTrainers = $trainers->filter(function ($trainer) {
                $studentsCount = DB::table('trainers_clients')
                    ->where('trainerID', $trainer->userID)
                    ->where('isActive', true)
                    ->count();
                return $studentsCount < 5;
            })->map(function ($trainer) use ($user) {
                $studentsCount = DB::table('trainers_clients')
                    ->where('trainerID', $trainer->userID)
                    ->where('isActive', true)
                    ->count();

                $isJoined = false;
                if ($user) {
                    $isJoined = DB::table('trainers_clients')
                        ->where('trainerID', $trainer->userID)
                        ->where('clientID', $user->userID)
                        ->where('isActive', true)
                        ->exists();
                }
                
                return [
                    'userID' => $trainer->userID,
                    'name' => $trainer->name,
                    'email' => $trainer->email,
                    'photo' => $trainer->profilePhoto ? asset('storage/' . $trainer->profilePhoto) : null,
                    'bio' => $trainer->bio,
                    'studentsCount' => $studentsCount,
                    'isJoined' => $isJoined,
                ];
            })->values();

            return response()->json([
                'trainers' => $availableTrainers,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener entrenadores disponibles: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Error al obtener entrenadores disponibles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function joinTrainer(Request $request)
    {
        try {
            $request->validate([
                'user_email' => 'required|email',
                'trainer_email' => 'required|email',
            ]);

            $user = User::where('email', $request->user_email)->where('role', 'user')->first();
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            $trainer = User::where('email', $request->trainer_email)->where('role', 'trainer')->first();
            if (!$trainer) {
                return response()->json(['message' => 'Entrenador no encontrado'], 404);
            }

            // Verificar si el usuario ya tiene un entrenador
            $existingTrainer = DB::table('trainers_clients')
                ->where('clientID', $user->userID)
                ->where('isActive', true)
                ->first();

            if ($existingTrainer) {
                if ($existingTrainer->trainerID === $trainer->userID) {
                    return response()->json(['message' => 'Ya estás unido a este entrenador'], 400);
                }
                return response()->json(['message' => 'Ya tienes un entrenador asignado. Debes abandonarlo primero.'], 400);
            }

            // Verificar límite de 5 estudiantes del entrenador
            $currentClientsCount = DB::table('trainers_clients')
                ->where('trainerID', $trainer->userID)
                ->where('isActive', true)
                ->count();

            if ($currentClientsCount >= 5) {
                return response()->json(['message' => 'Este entrenador ya tiene el máximo de 5 estudiantes'], 400);
            }

            // Crear la relación
            DB::table('trainers_clients')->insert([
                'trainerID' => $trainer->userID,
                'clientID' => $user->userID,
                'isActive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Te has unido exitosamente al entrenador',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al unirse al entrenador: ' . $e->getMessage());
            return response()->json(['message' => 'Error al unirse al entrenador'], 500);
        }
    }

    public function leaveTrainer(Request $request)
    {
        try {
            $request->validate([
                'user_email' => 'required|email',
            ]);

            $user = User::where('email', $request->user_email)->where('role', 'user')->first();
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Desactivar la relación
            $updated = DB::table('trainers_clients')
                ->where('clientID', $user->userID)
                ->where('isActive', true)
                ->update([
                    'isActive' => false,
                    'updated_at' => now(),
                ]);

            if ($updated === 0) {
                return response()->json(['message' => 'No tienes un entrenador asignado'], 404);
            }

            return response()->json([
                'message' => 'Has abandonado al entrenador exitosamente',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al abandonar entrenador: ' . $e->getMessage());
            return response()->json(['message' => 'Error al abandonar entrenador'], 500);
        }
    }

    public function getMyTrainer(Request $request)
    {
        try {
            $userEmail = $request->query('user_email');
            if (!$userEmail) {
                return response()->json(['message' => 'Email de usuario requerido'], 400);
            }

            $user = User::where('email', $userEmail)->where('role', 'user')->first();
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            $trainerRelation = DB::table('trainers_clients')
                ->where('clientID', $user->userID)
                ->where('isActive', true)
                ->first();

            if (!$trainerRelation) {
                return response()->json(['trainer' => null]);
            }

            $trainer = User::where('userID', $trainerRelation->trainerID)->first();
            if (!$trainer) {
                return response()->json(['trainer' => null]);
            }

            return response()->json([
                'trainer' => [
                    'userID' => $trainer->userID,
                    'name' => $trainer->name,
                    'email' => $trainer->email,
                    'photo' => $trainer->profilePhoto ? asset('storage/' . $trainer->profilePhoto) : null,
                    'bio' => $trainer->bio,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener entrenador: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener entrenador'], 500);
        }
    }

    public function getStudentProgress(Request $request)
    {
        try {
            $trainerEmail = $request->query('trainer_email');
            $studentEmail = $request->query('student_email');

            if (!$trainerEmail || !$studentEmail) {
                return response()->json(['message' => 'Email de entrenador y estudiante requeridos'], 400);
            }

            $trainer = User::where('email', $trainerEmail)->where('role', 'trainer')->first();
            if (!$trainer) {
                return response()->json(['message' => 'Entrenador no encontrado'], 404);
            }

            $student = User::where('email', $studentEmail)->where('role', 'user')->first();
            if (!$student) {
                return response()->json(['message' => 'Estudiante no encontrado'], 404);
            }

            // Verificar que el estudiante pertenece al entrenador
            $relation = DB::table('trainers_clients')
                ->where('trainerID', $trainer->userID)
                ->where('clientID', $student->userID)
                ->where('isActive', true)
                ->first();

            if (!$relation) {
                return response()->json(['message' => 'Este estudiante no pertenece a este entrenador'], 403);
            }

            // Obtener progreso del estudiante (rutinas completadas)
            $completions = DB::table('routine_completions')
                ->where('routine_completions.userID', $student->userID)
                ->join('routines', 'routine_completions.routineID', '=', 'routines.routineID')
                ->select(
                    'routine_completions.completionID',
                    'routine_completions.routineID',
                    'routine_completions.completed_at',
                    'routines.routineName',
                    'routines.goal'
                )
                ->orderBy('routine_completions.completed_at', 'desc')
                ->get();

            $progress = [];
            foreach ($completions as $completion) {
                try {
                    $exercises = DB::table('routine_completion_exercises')
                        ->where('completionID', $completion->completionID)
                        ->join('exercises', 'routine_completion_exercises.exerciseID', '=', 'exercises.exerciseID')
                        ->select(
                            'exercises.exerciseName',
                            'exercises.muscleGroup',
                            'routine_completion_exercises.sets',
                            'routine_completion_exercises.reps',
                            'routine_completion_exercises.weight',
                        )
                        ->get();

                    $exerciseList = [];
                    foreach ($exercises as $exercise) {
                        $exerciseList[] = [
                            'name' => $exercise->exerciseName,
                            'muscleGroup' => $exercise->muscleGroup,
                            'sets' => $exercise->sets,
                            'reps' => $exercise->reps,
                            'weight' => $exercise->weight,
                        ];
                    }

                    $progress[] = [
                        'id' => $completion->completionID,
                        'routineID' => $completion->routineID,
                        'routineName' => $completion->routineName,
                        'goal' => $completion->goal,
                        'completed_at' => $completion->completed_at,
                        'exercises' => $exerciseList,
                    ];
                } catch (\Exception $e) {
                    Log::error('Error al procesar completion:', ['completionID' => $completion->completionID, 'error' => $e->getMessage()]);
                    continue;
                }
            }

            return response()->json([
                'progress' => $progress,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener progreso del estudiante: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener progreso'], 500);
        }
    }

    public function getTrainerRoutines(Request $request)
    {
        try {
            $userEmail = $request->query('user_email');
            if (!$userEmail) {
                return response()->json(['message' => 'Email de usuario requerido'], 400);
            }

            $user = User::where('email', $userEmail)->where('role', 'user')->first();
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Verificar que el usuario tenga un entrenador
            $trainerRelation = DB::table('trainers_clients')
                ->where('clientID', $user->userID)
                ->where('isActive', true)
                ->first();

            if (!$trainerRelation) {
                return response()->json([
                    'routines' => [],
                    'trainer' => null,
                ]);
            }

            // Obtener información del entrenador
            $trainer = User::where('userID', $trainerRelation->trainerID)->first();

            // Obtener rutinas creadas por el entrenador para este usuario
            // Buscamos rutinas donde el userID es el del cliente
            // Solo mostramos rutinas creadas después de que se estableció la relación entrenador-cliente
            $routines = DB::table('routines')
                ->where('userID', $user->userID)
                ->where('isActive', true)
                ->where('created_at', '>=', $trainerRelation->created_at)
                ->orderBy('created_at', 'desc')
                ->get();

            // Obtener ejercicios para cada rutina
            $routinesWithExercises = $routines->map(function ($routine) {
                $exercises = DB::table('routine_exercises')
                    ->join('exercises', 'routine_exercises.exerciseID', '=', 'exercises.exerciseID')
                    ->where('routine_exercises.routineID', $routine->routineID)
                    ->where('routine_exercises.isActive', true)
                    ->select(
                        'exercises.exerciseID',
                        'exercises.exerciseName',
                        'exercises.muscleGroup',
                        'routine_exercises.sets',
                        'routine_exercises.reps',
                        'routine_exercises.weight'
                    )
                    ->get();

                return [
                    'routineID' => $routine->routineID,
                    'routineName' => $routine->routineName,
                    'goal' => $routine->goal,
                    'created_at' => $routine->created_at,
                    'exercises_count' => $exercises->count(),
                    'exercises' => $exercises->map(function ($exercise) {
                        return [
                            'exerciseID' => $exercise->exerciseID,
                            'exerciseName' => $exercise->exerciseName,
                            'muscleGroup' => $exercise->muscleGroup,
                            'sets' => $exercise->sets,
                            'reps' => $exercise->reps,
                            'weight' => $exercise->weight,
                        ];
                    })->values(),
                ];
            })->values();

            return response()->json([
                'routines' => $routinesWithExercises,
                'trainer' => $trainer ? [
                    'userID' => $trainer->userID,
                    'name' => $trainer->name,
                    'email' => $trainer->email,
                    'photo' => $trainer->profilePhoto ? asset('storage/' . $trainer->profilePhoto) : null,
                    'bio' => $trainer->bio,
                ] : null,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener rutinas del entrenador: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Error al obtener rutinas del entrenador'], 500);
        }
    }
}

