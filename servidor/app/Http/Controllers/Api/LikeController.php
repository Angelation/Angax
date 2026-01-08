<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'post_id' => ['required', 'integer', 'exists:posts,postID'],
            'user_email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['user_email'])->first();
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        $post = Post::where('postID', $validated['post_id'])->first();
        if (!$post) {
            return response()->json([
                'message' => 'Publicación no encontrada',
            ], 404);
        }

        $existingLike = Like::where('postID', $post->postID)
            ->where('userID', $user->userID)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            Like::create([
                'postID' => $post->postID,
                'userID' => $user->userID,
                'likeDate' => now(),
                'isActive' => true,
            ]);
            $liked = true;
        }

        $likesCount = Like::where('postID', $post->postID)->count();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }
}

