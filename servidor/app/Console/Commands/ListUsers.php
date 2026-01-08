<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ListUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lista todos los usuarios registrados en el sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        if ($users->isEmpty()) {
            $this->info('No hay usuarios registrados.');
            return 0;
        }

        $this->info('=== USUARIOS REGISTRADOS ===');
        $this->newLine();

        $headers = ['ID', 'Nombre', 'Email', 'Rol', 'Fecha Registro'];
        $data = $users->map(function ($user) {
            return [
                $user->userID,
                $user->name,
                $user->email,
                $user->role ?? 'user',
                $user->created_at->format('Y-m-d H:i:s'),
            ];
        })->toArray();

        $this->table($headers, $data);
        $this->newLine();
        $this->info('Total: ' . $users->count() . ' usuario(s)');

        return 0;
    }
}
