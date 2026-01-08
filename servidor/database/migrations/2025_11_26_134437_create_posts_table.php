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
        // Si la tabla ya existe, usar la migración de actualización en su lugar
        if (Schema::hasTable('posts')) {
            // La tabla ya existe, la migración de actualización se encargará de modificarla
            return;
        }
        
        Schema::create('posts', function (Blueprint $table) {
            $table->id('postID');
            $table->unsignedBigInteger('userID')->index();
            $table->text('content');
            // SQLite no soporta default(now()) para dateTime, lo manejamos en el código
            $table->dateTime('postDate')->nullable();
            $table->string('image', 255)->nullable();
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
        Schema::dropIfExists('posts');
    }
};
