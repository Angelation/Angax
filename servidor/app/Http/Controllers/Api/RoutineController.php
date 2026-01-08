<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Routine;
use App\Models\Exercise;
use App\Models\RoutineExercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class RoutineController extends Controller
{
    public function index(Request $request)
    {
        $query = Routine::query()
            ->where('isActive', true) 
            ->with(['exercises' => function ($q) {
                $q->where('routine_exercises.isActive', true);
            }]);

        $user = null;
        if ($request->filled('user_email')) {
            $user = DB::table('users')->where('email', $request->string('user_email'))->first();
            if ($user) {
                $query->where('userID', $user->userID);
            }
        }

        $routines = $query->latest()->get();

        if ($user) {
            $statsByRoutineId = DB::table('routine_completions')
                ->where('userID', $user->userID)
                ->select(
                    'routineID',
                    DB::raw('COUNT(*) as completions_count'),
                    DB::raw('MAX(completed_at) as last_completed_at')
                )
                ->groupBy('routineID')
                ->get()
                ->keyBy('routineID');

            $routines = $routines->map(function ($routine) use ($statsByRoutineId) {
                $stats = $statsByRoutineId->get($routine->routineID);
                $routine->completions_count = (int) ($stats->completions_count ?? 0);
                $routine->last_completed_at = $stats->last_completed_at ?? null;
                return $routine;
            });
        }

        return response()->json($routines);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_email' => ['required', 'email'],
            'client_email' => ['nullable', 'email'], // Email del cliente si es un entrenador creando para su cliente
            'routineName' => ['required', 'string', 'max:100'],
            'goal' => ['nullable', 'string', 'max:255'],
            'exercises' => ['required', 'array', 'min:1'],
            'exercises.*.exerciseName' => ['required', 'string'],
            'exercises.*.muscleGroup' => ['required', 'string'],
            'exercises.*.imagePath' => ['required', 'string'],
            'exercises.*.sets' => ['required', 'integer', 'min:1'],
            'exercises.*.reps' => ['required', 'integer', 'min:1'],
            'exercises.*.weight' => ['nullable', 'numeric', 'min:0'],
        ]);

        $trainer = DB::table('users')->where('email', $data['user_email'])->first();
        if (!$trainer) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Si se proporciona client_email, verificar que el entrenador tenga acceso a ese cliente
        if (!empty($data['client_email'])) {
            $client = DB::table('users')->where('email', $data['client_email'])->where('role', 'user')->first();
            if (!$client) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            // Verificar que el entrenador tenga este cliente asignado
            $hasAccess = DB::table('trainers_clients')
                ->where('trainerID', $trainer->userID)
                ->where('clientID', $client->userID)
                ->where('isActive', true)
                ->exists();

            if (!$hasAccess) {
                return response()->json(['message' => 'No tienes acceso a este cliente'], 403);
            }

            $user = $client; // Usar el cliente como el usuario para quien se crea la rutina
        } else {
            $user = $trainer; // Usar el entrenador como el usuario
        }

        DB::beginTransaction();
        try {
            // Crear la rutina
            $routine = Routine::create([
                'userID' => $user->userID,
                'routineName' => $data['routineName'],
                'goal' => $data['goal'] ?? null,
                'isActive' => true,
            ]);

            foreach ($data['exercises'] as $exerciseData) {
                $exercise = Exercise::firstOrCreate(
                    [
                        'exerciseName' => $exerciseData['exerciseName'],
                        'muscleGroup' => $exerciseData['muscleGroup'],
                    ],
                    [
                        'description' => null,
                        'isActive' => true,
                    ]
                );

                RoutineExercise::create([
                    'routineID' => $routine->routineID,
                    'exerciseID' => $exercise->exerciseID,
                    'sets' => $exerciseData['sets'],
                    'reps' => $exerciseData['reps'],
                    'weight' => $exerciseData['weight'] ?? null,
                    'isActive' => true,
                ]);
            }

            DB::commit();

            $routine->load('exercises');
            return response()->json($routine, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear la rutina: ' . $e->getMessage()], 500);
        }
    }

    public function getAvailableExercises()
    {
        $categories = [
            'abdomen' => [
                ['name' => 'Cocoons', 'file' => 'Cocoons.gif'],
                ['name' => 'Crunch cruzado', 'file' => 'Crunch cruzado.gif'],
                ['name' => 'Crunch doble vertical en máquina', 'file' => 'Crunch doble vertical en máquina.gif'],
                ['name' => 'Crunch superior de pie con polea delante', 'file' => 'Crunch superior de pie con polea delante.gif'],
                ['name' => 'Plancha', 'file' => 'Plancha.gif'],
            ],
            'brazos' => [
                ['name' => 'Curl con barra', 'file' => 'Curl con barra.gif'],
                ['name' => 'Curl con mancuernas', 'file' => 'Curl con mancuernas.gif'],
                ['name' => 'Curl en martillo', 'file' => 'Curl en martillo.gif'],
                ['name' => 'Extensión de tríceps en polea', 'file' => 'Extensión de tríceps en polea.gif'],
                ['name' => 'Fondos en paralelas', 'file' => 'Fondos en paralelas.gif'],
            ],
            'espalda' => [
                ['name' => 'Dominada', 'file' => 'dominada.gif'],
                ['name' => 'Jalón al pecho', 'file' => 'Jalón al pecho.gif'],
                ['name' => 'Remo con barra', 'file' => 'Remo con barra.gif'],
                ['name' => 'Remo con mancuernas', 'file' => 'Remo con mancuernas.gif'],
                ['name' => 'Remo horizontal en supinación en máquina', 'file' => 'Remo horizontal en supinación en máquina.gif'],
            ],
            'gluteos' => [
                ['name' => 'Extensión trasera aislada en polea baja', 'file' => 'Extensión trasera aislada en polea baja.gif'],
                ['name' => 'Hip Thrust con barra', 'file' => 'Hip Thrust con barra.gif'],
                ['name' => 'Peso muerto en punta', 'file' => 'Peso muerto en punta.gif'],
                ['name' => 'Puente lateral', 'file' => 'Puente lateral.gif'],
                ['name' => 'Zancadas lateral con mancuerna', 'file' => 'Zancadas latreal con mancuerna.gif'],
            ],
            'hombro' => [
                ['name' => 'Elevación lateral horizontal aislada con mancuerna', 'file' => 'Elevación lateral horizontal aislada con mancuerna.gif'],
                ['name' => 'Elevaciones laterales con banda', 'file' => 'Elevaciones laterales con banda.gif'],
                ['name' => 'Elevaciones laterales con mancuernas', 'file' => 'Elevaciones laterales con mancuernas.gif'],
                ['name' => 'Pájaros aislados en polea', 'file' => 'Pájaros aislados en polea.gif'],
                ['name' => 'Press militar con barra', 'file' => 'Press militar con barra.gif'],
            ],
            'pecho' => [
                ['name' => 'Chest press en máquina', 'file' => 'Chest press en máquina.gif'],
                ['name' => 'Flexiones (Push Ups)', 'file' => 'Flexiones (Push Ups).gif'],
                ['name' => 'Press banca con barra', 'file' => 'Press banca con barra.gif'],
                ['name' => 'Press frontal con poleas', 'file' => 'Press frontal con poleas.gif'],
                ['name' => 'Press inclinado con mancuernas', 'file' => 'Press inclinado con mancuernas.gif'],
            ],
            'piernas' => [
                ['name' => 'Curl femoral', 'file' => 'Curl femoral.gif'],
                ['name' => 'Peso muerto rumano con mancuernas', 'file' => 'Peso muerto rumano con mancuernas.gif'],
                ['name' => 'Prensa inclinada', 'file' => 'Prensa inclinada.gif'],
                ['name' => 'Sentadilla con barra', 'file' => 'Sentadilla con barra.gif'],
                ['name' => 'Zancadas', 'file' => 'Zancadas.gif'],
            ],
        ];

        $exercises = [];
        foreach ($categories as $category => $exerciseList) {
            $exercises[$category] = [];
            foreach ($exerciseList as $exercise) {
                $exercises[$category][] = [
                    'name' => $exercise['name'],
                    'imagePath' => "/ejercicios/{$category}/{$exercise['file']}",
                    'muscleGroup' => $category,
                ];
            }
        }

        return response()->json($exercises);
    }

    public function destroy(Request $request, $id)
    {
        $user = DB::table('users')->where('email', $request->string('user_email'))->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $routine = Routine::where('routineID', $id)->where('userID', $user->userID)->first();
        if (!$routine) {
            return response()->json(['message' => 'Rutina no encontrada'], 404);
        }

        $routine->isActive = false;
        $routine->save();

        DB::table('routine_exercises')
            ->where('routineID', $routine->routineID)
            ->update(['isActive' => false]);

        return response()->json(['message' => 'Rutina eliminada correctamente']);
    }

    public function complete(Request $request, $id)
    {
        $data = $request->validate([
            'user_email' => ['required', 'email'],
            'performed_at' => ['nullable', 'date'],
            'exercises' => ['nullable', 'array'],
            'exercises.*.exerciseID' => ['required_with:exercises', 'integer', 'exists:exercises,exerciseID'],
            'exercises.*.sets' => ['nullable', 'integer', 'min:0'],
            'exercises.*.reps' => ['nullable', 'integer', 'min:0'],
            'exercises.*.weight' => ['nullable', 'numeric', 'min:0'],
        ]);

        $user = DB::table('users')->where('email', $data['user_email'])->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $routine = Routine::where('routineID', $id)
            ->where('userID', $user->userID)
            ->with(['exercises' => function ($q) {
                $q->where('routine_exercises.isActive', true);
            }])
            ->first();

        if (!$routine) {
            return response()->json(['message' => 'Rutina no encontrada'], 404);
        }

        Log::info('Rutina encontrada para completar:', [
            'routineID' => $routine->routineID,
            'routineName' => $routine->routineName,
            'exercises_count' => $routine->exercises->count(),
        ]);


        DB::beginTransaction();
        try {
            $performedAt = array_key_exists('performed_at', $data) && $data['performed_at']
                ? Carbon::parse($data['performed_at'])
                : now();

            $completion = DB::table('routine_completions')->insertGetId([
                'routineID' => $routine->routineID,
                'userID' => $user->userID,
                'completed_at' => $performedAt->toDateTimeString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('Completación creada:', ['completionID' => $completion, 'routineID' => $routine->routineID, 'userID' => $user->userID]);

            $allowedExerciseIds = $routine->exercises->map(fn ($ex) => (int) $ex->exerciseID)->flip();
            $inputByExerciseId = collect($data['exercises'] ?? [])
                ->filter(fn ($row) => isset($row['exerciseID']) && $allowedExerciseIds->has((int) $row['exerciseID']))
                ->keyBy(fn ($row) => (int) $row['exerciseID']);

            $exercisesCount = 0;
            foreach ($routine->exercises as $exercise) {
                try {
                    $input = $inputByExerciseId->get((int) $exercise->exerciseID, []);
                    $sets = array_key_exists('sets', $input) ? (int) $input['sets'] : (int) ($exercise->pivot->sets ?? 0);
                    $reps = array_key_exists('reps', $input) ? (int) $input['reps'] : (int) ($exercise->pivot->reps ?? 0);
                    $weight = array_key_exists('weight', $input) ? $input['weight'] : ($exercise->pivot->weight ?? null);

                    DB::table('routine_completion_exercises')->insert([
                        'completionID' => $completion,
                        'exerciseID' => $exercise->exerciseID,
                        'sets' => $sets,
                        'reps' => $reps,
                        'weight' => $weight,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $exercisesCount++;
                    Log::info('Ejercicio guardado:', [
                        'completionID' => $completion,
                        'exerciseID' => $exercise->exerciseID,
                        'exerciseName' => $exercise->exerciseName,
                        'sets' => $sets,
                        'reps' => $reps,
                        'weight' => $weight,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error al guardar ejercicio:', [
                        'completionID' => $completion,
                        'exerciseID' => $exercise->exerciseID ?? 'N/A',
                        'error' => $e->getMessage(),
                    ]);
                    throw $e;
                }
            }

            Log::info('Ejercicios guardados:', ['completionID' => $completion, 'count' => $exercisesCount]);

            DB::commit();

            return response()->json([
                'message' => 'Entrenamiento guardado correctamente',
                'completion_id' => $completion,
                'completed_at' => $performedAt->toISOString(),
                'exercises_count' => $exercisesCount,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al completar rutina:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Error al completar la rutina: ' . $e->getMessage()], 500);
        }
    }
}

