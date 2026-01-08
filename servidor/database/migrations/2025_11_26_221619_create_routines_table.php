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
        Schema::create('routines', function (Blueprint $table) {
            $table->id('routineID');
            $table->unsignedBigInteger('userID')->index();
            $table->string('routineName', 100);
            $table->string('goal', 255)->nullable();
            $table->date('creationDate')->default(now());
            $table->boolean('isActive')->default(true);
            $table->timestamps();
            
            // Usar 'userID' como clave primaria de users
            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routines');
    }
};
