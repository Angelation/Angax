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
        // Verificar si la tabla existe y agregar columnas faltantes
        if (Schema::hasTable('posts')) {
            Schema::table('posts', function (Blueprint $table) {
                // Agregar userID si no existe
                if (!Schema::hasColumn('posts', 'userID')) {
                    $table->unsignedBigInteger('userID')->nullable();
                }
                
                // Agregar postDate si no existe
                if (!Schema::hasColumn('posts', 'postDate')) {
                    $table->dateTime('postDate')->nullable();
                }
                
                // Agregar image si no existe
                if (!Schema::hasColumn('posts', 'image')) {
                    $table->string('image', 255)->nullable();
                }
                
                // Agregar isActive si no existe
                if (!Schema::hasColumn('posts', 'isActive')) {
                    $table->boolean('isActive')->default(true);
                }
            });

            // Migrar datos de user_email a userID si existe user_email
            if (Schema::hasColumn('posts', 'user_email') && Schema::hasColumn('posts', 'userID')) {
                $posts = \DB::table('posts')->whereNotNull('user_email')->whereNull('userID')->get();
                
                foreach ($posts as $post) {
                    $user = \DB::table('users')->where('email', $post->user_email)->first();
                    if ($user) {
                        \DB::table('posts')
                            ->where('id', $post->id)
                            ->update([
                                'userID' => $user->userID,
                                'postDate' => $post->created_at ?? now(),
                                'image' => $post->image_url ?? null,
                                'isActive' => true,
                            ]);
                    }
                }
            }

            // Agregar foreign key solo si no existe y no es SQLite (SQLite no soporta bien foreign keys dinámicas)
            if (Schema::hasColumn('posts', 'userID') && \DB::getDriverName() !== 'sqlite') {
                try {
                    $foreignKeys = \DB::select("
                        SELECT CONSTRAINT_NAME 
                        FROM information_schema.KEY_COLUMN_USAGE 
                        WHERE TABLE_SCHEMA = DATABASE() 
                        AND TABLE_NAME = 'posts' 
                        AND COLUMN_NAME = 'userID' 
                        AND REFERENCED_TABLE_NAME IS NOT NULL
                    ");
                    
                    if (empty($foreignKeys)) {
                        Schema::table('posts', function (Blueprint $table) {
                            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
                        });
                    }
                } catch (\Exception $e) {
                    // Si falla (por ejemplo, en SQLite), simplemente continuar sin foreign key
                    // SQLite manejará las relaciones de forma lógica pero no física
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('posts')) {
            Schema::table('posts', function (Blueprint $table) {
                if (Schema::hasColumn('posts', 'userID')) {
                    $table->dropForeign(['userID']);
                    $table->dropColumn('userID');
                }
                if (Schema::hasColumn('posts', 'postDate')) {
                    $table->dropColumn('postDate');
                }
                if (Schema::hasColumn('posts', 'image') && !Schema::hasColumn('posts', 'image_url')) {
                    $table->renameColumn('image', 'image_url');
                }
                if (Schema::hasColumn('posts', 'isActive')) {
                    $table->dropColumn('isActive');
                }
            });
        }
    }
};
