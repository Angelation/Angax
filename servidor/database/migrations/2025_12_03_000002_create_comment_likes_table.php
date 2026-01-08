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
        if (Schema::hasTable('comment_likes')) {
            return;
        }

        Schema::create('comment_likes', function (Blueprint $table) {
            $table->id('likeID');
            $table->unsignedBigInteger('commentID')->index();
            $table->unsignedBigInteger('userID')->index();
            $table->timestamps();

            $table->foreign('commentID')->references('commentID')->on('comments')->onDelete('cascade');
            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
            
            // Evitar likes duplicados
            $table->unique(['commentID', 'userID']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment_likes');
    }
};

