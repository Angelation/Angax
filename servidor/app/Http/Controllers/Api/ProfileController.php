<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Routine;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json(['message' => 'Email requerido'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $currentUserEmail = $request->query('current_user_email');
        $isFollowing = false;
        $isMutual = false;
        
        if ($currentUserEmail && $currentUserEmail !== $email) {
            $currentUser = User::where('email', $currentUserEmail)->first();
            if ($currentUser) {
                $isFollowing = Follow::where('followerID', $currentUser->userID)
                    ->where('followingID', $user->userID)
                    ->exists();
                
                $isMutual = $isFollowing && Follow::where('followerID', $user->userID)
                    ->where('followingID', $currentUser->userID)
                    ->exists();
            }
        }

        $routines = Routine::where('userID', $user->userID)
            ->where('isActive', true) // Solo mostrar rutinas activas
            ->with(['exercises' => function ($query) {
                $query->where('routine_exercises.isActive', true);
            }])
            ->latest()
            ->get(['routineID', 'routineName', 'goal', 'created_at']);

        $followersCount = Follow::where('followingID', $user->userID)->count();
        $followingCount = Follow::where('followerID', $user->userID)->count();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'bio' => $user->bio,
                'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
                'is_following' => $isFollowing,
                'is_mutual' => $isMutual,
                'followers_count' => $followersCount,
                'following_count' => $followingCount,
            ],
            'programs' => $routines->map(function ($routine) {
                return [
                    'id' => $routine->routineID,
                    'title' => $routine->routineName,
                    'goal' => $routine->goal,
                    'created_at' => $routine->created_at,
                    'exercises_count' => $routine->exercises->count(),
                    'exercises' => $routine->exercises->map(function ($exercise) {
                        $imagePath = $this->getExerciseImagePath($exercise->exerciseName, $exercise->muscleGroup);
                        return [
                            'id' => $exercise->exerciseID,
                            'name' => $exercise->exerciseName,
                            'muscleGroup' => $exercise->muscleGroup,
                            'sets' => $exercise->pivot->sets,
                            'reps' => $exercise->pivot->reps,
                            'weight' => $exercise->pivot->weight,
                            'imagePath' => $imagePath,
                        ];
                    }),
                ];
            }),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'user_email' => ['required', 'email', 'exists:users,email'],
            'name' => ['required', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:600'],
            'profile_photo' => ['nullable', 'image', 'max:3072'],
        ]);

        $user = User::where('email', $data['user_email'])->first();

        $updates = [
            'name' => $data['name'],
            'bio' => $data['bio'] ?? null,
        ];

        if ($request->hasFile('profile_photo')) {
            if ($user->profilePhoto) {
                Storage::disk('public')->delete($user->profilePhoto);
            }
            $path = $request->file('profile_photo')->store('profiles', 'public');
            $updates['profilePhoto'] = $path;
        }

        $user->fill($updates);
        $user->save();

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $user->bio,
            'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
        ]);
    }

    private function getExerciseImagePath($exerciseName, $muscleGroup)
    {
        $exerciseMap = [
            'abdomen' => [
                'Cocoons' => 'Cocoons.gif',
                'Crunch cruzado' => 'Crunch cruzado.gif',
                'Crunch doble vertical en máquina' => 'Crunch doble vertical en máquina.gif',
                'Crunch superior de pie con polea delante' => 'Crunch superior de pie con polea delante.gif',
                'Plancha' => 'Plancha.gif',
            ],
            'brazos' => [
                'Curl con barra' => 'Curl con barra.gif',
                'Curl con mancuernas' => 'Curl con mancuernas.gif',
                'Curl en martillo' => 'Curl en martillo.gif',
                'Extensión de tríceps en polea' => 'Extensión de tríceps en polea.gif',
                'Fondos en paralelas' => 'Fondos en paralelas.gif',
            ],
            'espalda' => [
                'Dominada' => 'dominada.gif',
                'dominada' => 'dominada.gif',
                'Jalón al pecho' => 'Jalón al pecho.gif',
                'Remo con barra' => 'Remo con barra.gif',
                'Remo con mancuernas' => 'Remo con mancuernas.gif',
                'Remo horizontal en supinación en máquina' => 'Remo horizontal en supinación en máquina.gif',
            ],
            'gluteos' => [
                'Extensión trasera aislada en polea baja' => 'Extensión trasera aislada en polea baja.gif',
                'Hip Thrust con barra' => 'Hip Thrust con barra.gif',
                'Peso muerto en punta' => 'Peso muerto en punta.gif',
                'Puente lateral' => 'Puente lateral.gif',
                'Zancadas lateral con mancuerna' => 'Zancadas latreal con mancuerna.gif',
            ],
            'hombro' => [
                'Elevación lateral horizontal aislada con mancuerna' => 'Elevación lateral horizontal aislada con mancuerna.gif',
                'Elevaciones laterales con banda' => 'Elevaciones laterales con banda.gif',
                'Elevaciones laterales con mancuernas' => 'Elevaciones laterales con mancuernas.gif',
                'Pájaros aislados en polea' => 'Pájaros aislados en polea.gif',
                'Press militar con barra' => 'Press militar con barra.gif',
            ],
            'pecho' => [
                'Chest press en máquina' => 'Chest press en máquina.gif',
                'Flexiones (Push Ups)' => 'Flexiones (Push Ups).gif',
                'Press banca con barra' => 'Press banca con barra.gif',
                'Press frontal con poleas' => 'Press frontal con poleas.gif',
                'Press inclinado con mancuernas' => 'Press inclinado con mancuernas.gif',
            ],
            'piernas' => [
                'Curl femoral' => 'Curl femoral.gif',
                'Peso muerto rumano con mancuernas' => 'Peso muerto rumano con mancuernas.gif',
                'Prensa inclinada' => 'Prensa inclinada.gif',
                'Sentadilla con barra' => 'Sentadilla con barra.gif',
                'Zancadas' => 'Zancadas.gif',
            ],
        ];

        $fileName = $exerciseMap[$muscleGroup][$exerciseName] ?? "{$exerciseName}.gif";
        return "/ejercicios/{$muscleGroup}/{$fileName}";
    }

    public function getProgress(Request $request)
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json(['message' => 'Email requerido'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        try {
            $completions = DB::table('routine_completions')
                ->where('routine_completions.userID', $user->userID)
                ->join('routines', 'routine_completions.routineID', '=', 'routines.routineID')
                ->orderBy('routine_completions.completed_at', 'desc')
                ->get([
                    'routine_completions.completionID',
                    'routine_completions.routineID',
                    'routine_completions.completed_at',
                    'routines.routineName',
                    'routines.goal',
                ]);
            
            Log::info('Completions encontradas:', ['count' => $completions->count(), 'user_id' => $user->userID]);
        } catch (\Exception $e) {
            Log::error('Error al obtener completions:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Error al cargar progreso: ' . $e->getMessage()], 500);
        }

        $progress = [];
        foreach ($completions as $completion) {
            try {
                $exercises = DB::table('routine_completion_exercises')
                    ->where('completionID', $completion->completionID)
                    ->join('exercises', 'routine_completion_exercises.exerciseID', '=', 'exercises.exerciseID')
                    ->get([
                        'exercises.exerciseName',
                        'exercises.muscleGroup',
                        'routine_completion_exercises.sets',
                        'routine_completion_exercises.reps',
                        'routine_completion_exercises.weight',
                    ]);

                Log::info('Ejercicios encontrados para completion:', ['completionID' => $completion->completionID, 'count' => $exercises->count()]);

                $exerciseList = [];
                foreach ($exercises as $exercise) {
                    $imagePath = $this->getExerciseImagePath($exercise->exerciseName, $exercise->muscleGroup);
                    $exerciseList[] = [
                        'name' => $exercise->exerciseName,
                        'muscleGroup' => $exercise->muscleGroup,
                        'sets' => $exercise->sets,
                        'reps' => $exercise->reps,
                        'weight' => $exercise->weight,
                        'imagePath' => $imagePath,
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

        Log::info('Progreso final:', ['count' => count($progress)]);
        return response()->json($progress);
    }

    public function getSuggestedUsers(Request $request)
    {
        $currentUserEmail = $request->query('current_user_email');
        $limit = min((int) $request->query('limit', 5), 10); // Máximo 10 usuarios
        
        $query = User::query()
            ->select('userID', 'name', 'email', 'profilePhoto', 'bio');
        
        if ($currentUserEmail) {
            $currentUser = User::where('email', $currentUserEmail)->first();
            if ($currentUser) {
                $query->where('userID', '!=', $currentUser->userID);
            }
        }
        
        $suggestedUsers = $query->inRandomOrder()->limit($limit)->get();
        
        return response()->json($suggestedUsers->map(function ($user) {
            return [
                'id' => $user->userID,
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo_url' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
                'bio' => $user->bio,
            ];
        }));
    }
}

