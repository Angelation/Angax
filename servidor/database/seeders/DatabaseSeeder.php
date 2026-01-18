<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    public function run(): void
    {
        // Crear usuario administrador si no existe
        $adminExists = DB::table('users')->where('email', 'angaxadmin@angax.com')->exists();
        
        if (!$adminExists) {
            DB::table('users')->insert([
                'name' => 'AngaX Admin',
                'email' => 'angaxadmin@angax.com',
                'password' => Hash::make('Angax123'),
                'role' => 'admin',
                'registerDate' => date('Y-m-d'),
                'isActive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            // Actualizar el admin si ya existe para asegurar que tenga los datos correctos
            DB::table('users')
                ->where('email', 'angaxadmin@angax.com')
                ->update([
                    'name' => 'AngaX Admin',
                    'password' => Hash::make('Angax123'),
                    'role' => 'admin',
                    'isActive' => true,
                    'updated_at' => now(),
                ]);
        }
    }
}
