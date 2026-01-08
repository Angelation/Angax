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
        if (Schema::hasTable('comments')) {
            return;
        }
        
        Schema::create('comments', function (Blueprint $table) {
            $table->id('commentID');
            $table->unsignedBigInteger('postID')->index();
            $table->unsignedBigInteger('userID')->index();
            $table->text('content');
            // SQLite no soporta default(now()) para dateTime, lo manejamos en el código
            $table->dateTime('commentDate')->nullable();
            $table->boolean('isActive')->default(true);
            $table->timestamps();
            
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
        Schema::dropIfExists('comments');
    }
};
