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
        Schema::create('routine_completions', function (Blueprint $table) {
            $table->id('completionID');
            $table->unsignedBigInteger('routineID');
            $table->unsignedBigInteger('userID');
            $table->timestamp('completed_at');
            $table->timestamps();
            
            $table->foreign('routineID')->references('routineID')->on('routines')->onDelete('cascade');
            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
        });

        Schema::create('routine_completion_exercises', function (Blueprint $table) {
            $table->id('completionExerciseID');
            $table->unsignedBigInteger('completionID');
            $table->unsignedBigInteger('exerciseID');
            $table->integer('sets');
            $table->integer('reps');
            $table->float('weight')->nullable();
            $table->timestamps();
            
            $table->foreign('completionID')->references('completionID')->on('routine_completions')->onDelete('cascade');
            $table->foreign('exerciseID')->references('exerciseID')->on('exercises')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routine_completion_exercises');
        Schema::dropIfExists('routine_completions');
    }
};

