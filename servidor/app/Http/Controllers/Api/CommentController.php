<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|integer|exists:posts,postID',
        ]);

        $userEmail = $request->query('user_email');
        $userId = null;
        if ($userEmail) {
            $user = User::where('email', $userEmail)->first();
            $userId = $user ? $user->userID : null;
        }

        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 4);

        $query = Comment::with(['user', 'replies.user', 'likes'])
            ->where('postID', $validated['post_id'])
            ->whereNull('parent_comment_id')
            ->where('isActive', true)
            ->orderByDesc('commentDate')
            ->orderByDesc('created_at');

        $total = $query->count();
        $comments = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get()
            ->map(function (Comment $comment) use ($userId) {
                return [
                    'id' => $comment->commentID,
                    'post_id' => $comment->postID,
                    'content' => $comment->content,
                    'user_name' => $comment->user->name ?? 'Usuario',
                    'user_email' => $comment->user->email ?? '',
                    'user_profile_photo' => $comment->user->profilePhoto ? Storage::url($comment->user->profilePhoto) : null,
                    'created_at' => ($comment->commentDate ?? $comment->created_at),
                    'parent_comment_id' => $comment->parent_comment_id,
                    'likes_count' => $comment->likes()->count(),
                    'liked_by_user' => $userId ? $comment->isLikedBy($userId) : false,
                    'replies' => $comment->replies->map(function (Comment $reply) use ($userId) {
                        return [
                            'id' => $reply->commentID,
                            'post_id' => $reply->postID,
                            'content' => $reply->content,
                            'user_name' => $reply->user->name ?? 'Usuario',
                            'user_email' => $reply->user->email ?? '',
                            'user_profile_photo' => $reply->user->profilePhoto ? Storage::url($reply->user->profilePhoto) : null,
                            'created_at' => ($reply->commentDate ?? $reply->created_at),
                            'parent_comment_id' => $reply->parent_comment_id,
                            'likes_count' => $reply->likes()->count(),
                            'liked_by_user' => $userId ? $reply->isLikedBy($userId) : false,
                        ];
                    }),
                ];
            });

        return response()->json([
            'data' => $comments,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|integer|exists:posts,postID',
            'user_email' => 'required|email',
            'content' => 'required|string|max:1000',
            'parent_comment_id' => 'nullable|integer|exists:comments,commentID',
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

        // Si es una respuesta, verificar que el comentario padre existe y pertenece al mismo post
        if (isset($validated['parent_comment_id'])) {
            $parentComment = Comment::where('commentID', $validated['parent_comment_id'])
                ->where('postID', $validated['post_id'])
                ->first();
            if (!$parentComment) {
                return response()->json([
                    'message' => 'Comentario padre no encontrado',
                ], 404);
            }
        }

        $comment = Comment::create([
            'postID' => $post->postID,
            'userID' => $user->userID,
            'content' => trim($validated['content']),
            'commentDate' => now(),
            'isActive' => true,
            'parent_comment_id' => $validated['parent_comment_id'] ?? null,
        ]);

        $comment->load(['user', 'likes']);

        return response()->json([
            'id' => $comment->commentID,
            'post_id' => $comment->postID,
            'user_name' => $comment->user->name ?? 'Usuario',
            'user_email' => $comment->user->email ?? '',
            'user_profile_photo' => $comment->user->profilePhoto ? Storage::url($comment->user->profilePhoto) : null,
            'content' => $comment->content,
            'created_at' => $comment->commentDate ?? $comment->created_at,
            'parent_comment_id' => $comment->parent_comment_id,
            'likes_count' => 0,
            'liked_by_user' => false,
            'replies' => [],
        ], 201);
    }

    public function destroy(Request $request, $commentId)
    {
        $validated = $request->validate([
            'user_email' => ['required_without:admin_email', 'email'],
            'admin_email' => ['required_without:user_email', 'email'],
        ]);

        $isAdmin = isset($validated['admin_email']);
        $email = $isAdmin ? $validated['admin_email'] : $validated['user_email'];
        
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        // Si es admin, verificar que tenga rol de admin
        if ($isAdmin && $user->role !== 'admin') {
            return response()->json([
                'message' => 'No tienes permisos de administrador',
            ], 403);
        }

        $comment = Comment::where('commentID', $commentId)->first();
        if (!$comment) {
            return response()->json([
                'message' => 'Comentario no encontrado',
            ], 404);
        }

        // Si no es admin, verificar que sea el dueño del comentario
        if (!$isAdmin && (int) $comment->userID !== (int) $user->userID) {
            return response()->json([
                'message' => 'Solo puedes eliminar tus propios comentarios.',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comentario eliminado correctamente.',
        ]);
    }

    public function toggleLike(Request $request, $commentId)
    {
        $validated = $request->validate([
            'user_email' => 'required|email',
        ]);

        $user = User::where('email', $validated['user_email'])->first();
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        $comment = Comment::where('commentID', $commentId)->first();
        if (!$comment) {
            return response()->json([
                'message' => 'Comentario no encontrado',
            ], 404);
        }

        $existingLike = CommentLike::where('commentID', $commentId)
            ->where('userID', $user->userID)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            CommentLike::create([
                'commentID' => $commentId,
                'userID' => $user->userID,
            ]);
            $liked = true;
        }

        $likesCount = CommentLike::where('commentID', $commentId)->count();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }
}

