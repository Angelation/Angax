<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregar role si no existe
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['user', 'trainer'])->default('user')->after('password');
            }
            
            // Agregar registerDate si no existe (SQLite no soporta default(now()))
            if (!Schema::hasColumn('users', 'registerDate')) {
                $table->date('registerDate')->nullable()->after('role');
            }
            
            // Agregar height si no existe
            if (!Schema::hasColumn('users', 'height')) {
                $table->float('height')->nullable()->after('registerDate');
            }
            
            // Agregar weight si no existe
            if (!Schema::hasColumn('users', 'weight')) {
                $table->float('weight')->nullable()->after('height');
            }
            
            // Agregar profilePhoto si no existe
            if (!Schema::hasColumn('users', 'profilePhoto')) {
                $table->string('profilePhoto', 255)->nullable()->after('weight');
            }
            
            // Agregar isActive si no existe
            if (!Schema::hasColumn('users', 'isActive')) {
                $table->boolean('isActive')->default(true)->after('profilePhoto');
            }
        });
        
        // Actualizar usuarios existentes para que tengan valores por defecto
        \DB::table('users')->whereNull('role')->update(['role' => 'user']);
        \DB::table('users')->whereNull('registerDate')->update(['registerDate' => now()]);
        \DB::table('users')->whereNull('isActive')->update(['isActive' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
            if (Schema::hasColumn('users', 'registerDate')) {
                $table->dropColumn('registerDate');
            }
            if (Schema::hasColumn('users', 'height')) {
                $table->dropColumn('height');
            }
            if (Schema::hasColumn('users', 'weight')) {
                $table->dropColumn('weight');
            }
            if (Schema::hasColumn('users', 'profilePhoto')) {
                $table->dropColumn('profilePhoto');
            }
            if (Schema::hasColumn('users', 'isActive')) {
                $table->dropColumn('isActive');
            }
        });
    }
};
