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
        Schema::create('follows', function (Blueprint $table) {
            $table->id('followID');
            $table->unsignedBigInteger('followerID'); // Usuario que sigue
            $table->unsignedBigInteger('followingID'); // Usuario que es seguido
            $table->timestamps();
            
            $table->foreign('followerID')->references('userID')->on('users')->onDelete('cascade');
            $table->foreign('followingID')->references('userID')->on('users')->onDelete('cascade');
            
            // Evitar duplicados: un usuario no puede seguir al mismo usuario dos veces
            $table->unique(['followerID', 'followingID']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
