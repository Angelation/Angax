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
        Schema::create('routine_exercises', function (Blueprint $table) {
            $table->id('routineExerciseID');
            $table->unsignedBigInteger('routineID');
            $table->unsignedBigInteger('exerciseID');
            $table->integer('sets')->nullable();
            $table->integer('reps')->nullable();
            $table->float('weight')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamps();
            
            $table->foreign('routineID')->references('routineID')->on('routines')->onDelete('cascade');
            $table->foreign('exerciseID')->references('exerciseID')->on('exercises')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routine_exercises');
    }
};
