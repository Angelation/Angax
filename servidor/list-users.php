<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "\n=== USUARIOS REGISTRADOS ===\n\n";

$users = User::all(['userID', 'name', 'email', 'role', 'created_at']);

if ($users->isEmpty()) {
    echo "No hay usuarios registrados.\n";
} else {
    printf("%-5s | %-20s | %-30s | %-10s | %-20s\n", "ID", "Nombre", "Email", "Rol", "Fecha Registro");
    echo str_repeat("-", 95) . "\n";
    
    foreach ($users as $user) {
        printf(
            "%-5d | %-20s | %-30s | %-10s | %-20s\n",
            $user->userID,
            substr($user->name, 0, 20),
            substr($user->email, 0, 30),
            $user->role ?? 'user',
            $user->created_at->format('Y-m-d H:i:s')
        );
    }
    
    echo "\nTotal: " . $users->count() . " usuario(s)\n";
}

echo "\n";

