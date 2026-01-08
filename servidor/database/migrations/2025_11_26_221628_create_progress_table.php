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
        Schema::create('progress', function (Blueprint $table) {
            $table->id('progressID');
            $table->unsignedBigInteger('userID')->index();
            $table->date('date')->default(now());
            $table->float('bodyWeight')->nullable();
            $table->float('bodyFat')->nullable();
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('progress');
    }
};
