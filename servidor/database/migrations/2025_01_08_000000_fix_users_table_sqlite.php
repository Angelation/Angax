<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Solo ejecutar si estamos usando SQLite
        if (DB::getDriverName() === 'sqlite') {
            // Verificar si la tabla users existe
            if (Schema::hasTable('users')) {
                // Intentar alterar la tabla solo si es necesario
                try {
                    // Si el campo role es ENUM, intentar cambiarlo a string
                    // SQLite no soporta ALTER COLUMN bien, así que solo verificamos
                    // que el campo exista
                    if (!Schema::hasColumn('users', 'role')) {
                        Schema::table('users', function (Blueprint $table) {
                            $table->string('role', 20)->default('user')->after('password');
                        });
                    }
                    
                    // Si registerDate no existe o es DATE, intentar cambiarlo
                    if (!Schema::hasColumn('users', 'registerDate')) {
                        Schema::table('users', function (Blueprint $table) {
                            $table->string('registerDate', 10)->nullable()->after('role');
                        });
                    }
                } catch (\Exception $e) {
                    // Si falla, simplemente continuar - la tabla puede ya estar correcta
                    // o necesitar ser recreada manualmente
                    \Log::warning('No se pudo alterar la tabla users: ' . $e->getMessage());
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer nada en el rollback
    }
};

