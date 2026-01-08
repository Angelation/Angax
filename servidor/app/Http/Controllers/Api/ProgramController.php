<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $programs = Program::query()
            ->when($request->filled('user_email'), fn ($query) => $query->where('user_email', $request->string('user_email')))
            ->latest()
            ->with('sessions')
            ->get();

        return response()->json($programs);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'email', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'frequency' => ['nullable', 'string', 'max:255'],
            'goal' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $program = Program::create($data);

        return response()->json($program, 201);
    }
}
