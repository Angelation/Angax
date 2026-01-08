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
        Schema::table('comments', function (Blueprint $table) {
            if (!Schema::hasColumn('comments', 'parent_comment_id')) {
                $table->unsignedBigInteger('parent_comment_id')->nullable()->after('postID');
                $table->foreign('parent_comment_id')->references('commentID')->on('comments')->onDelete('cascade');
                $table->index('parent_comment_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            if (Schema::hasColumn('comments', 'parent_comment_id')) {
                $table->dropForeign(['parent_comment_id']);
                $table->dropIndex(['parent_comment_id']);
                $table->dropColumn('parent_comment_id');
            }
        });
    }
};

