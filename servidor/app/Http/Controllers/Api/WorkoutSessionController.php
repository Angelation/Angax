<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutSession;
use Illuminate\Http\Request;

class WorkoutSessionController extends Controller
{
    public function index(Request $request)
    {
        $sessions = WorkoutSession::query()
            ->when($request->filled('user_email'), fn ($query) => $query->where('user_email', $request->string('user_email')))
            ->latest('performed_at')
            ->latest()
            ->limit(25)
            ->get();

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id' => ['nullable', 'exists:programs,id'],
            'user_email' => ['required', 'email', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'exercises_count' => ['nullable', 'integer', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'performed_at' => ['nullable', 'date'],
        ]);

        $session = WorkoutSession::create($data);

        return response()->json($session, 201);
    }
}
