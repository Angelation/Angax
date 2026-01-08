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
        // Eliminar la tabla si existe (por si falló una migración anterior)
        Schema::dropIfExists('trainers_clients');
        
        Schema::create('trainers_clients', function (Blueprint $table) {
            $table->id('trainerClientID');
            $table->unsignedBigInteger('trainerID')->index();
            $table->unsignedBigInteger('clientID')->index();
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });
        
        // Agregar foreign keys después de crear la tabla
        Schema::table('trainers_clients', function (Blueprint $table) {
            $table->foreign('trainerID')->references('userID')->on('users')->onDelete('cascade');
            $table->foreign('clientID')->references('userID')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainers_clients');
    }
};
