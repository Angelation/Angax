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
        if (Schema::hasTable('likes')) {
            return;
        }
        
        Schema::create('likes', function (Blueprint $table) {
            $table->id('likeID');
            $table->unsignedBigInteger('postID')->index();
            $table->unsignedBigInteger('userID')->index();
            $table->dateTime('likeDate')->default(now());
            $table->boolean('isActive')->default(true);
            $table->timestamps();
            
            // Evitar likes duplicados (crear antes de las foreign keys)
            $table->unique(['postID', 'userID']);
            
            // posts tiene 'postID' como clave primaria, users tiene 'userID'
            $table->foreign('postID')->references('postID')->on('posts')->onDelete('cascade');
            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
