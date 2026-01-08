<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query();
        
        if (Schema::hasColumn('posts', 'isActive')) {
            $query->where('isActive', true);
        }
        
        if (Schema::hasColumn('posts', 'postDate')) {
            $query->latest('postDate');
        } else {
            $query->latest('created_at');
        }
        
        $rawPosts = $query->limit(50)->get();

        $postIds = $rawPosts->map(function ($post) {
            return $post->postID ?? $post->id;
        })->filter()->values();

        $likeCounts = $postIds->isNotEmpty()
            ? Like::whereIn('postID', $postIds)
                ->select('postID', DB::raw('COUNT(*) as total'))
                ->groupBy('postID')
                ->pluck('total', 'postID')
            : collect();

        $likedByUser = collect();
        if ($postIds->isNotEmpty() && $request->filled('user_email')) {
            $user = User::where('email', $request->string('user_email'))->first();
            if ($user) {
                $likedByUser = Like::where('userID', $user->userID)
                    ->whereIn('postID', $postIds)
                    ->pluck('postID')
                    ->flip();
            }
        }

        $posts = $rawPosts->map(function ($post) use ($likeCounts, $likedByUser) {
            $userID = $post->userID ?? null;
            $userName = null;
            $userEmail = null;

            $userProfilePhoto = null;
            if ($userID) {
                $user = User::find($userID);
                $userName = $user->name ?? 'Usuario';
                $userEmail = $user->email ?? '';
                $userProfilePhoto = $user->profilePhoto ? Storage::url($user->profilePhoto) : null;
            } else {
                $userName = $post->user_name ?? 'Usuario';
                $userEmail = $post->user_email ?? '';
            }

            $imageUrl = null;
            if ($post->image) {
                $imageUrl = Storage::url($post->image);
            } elseif (isset($post->image_url)) {
                $imageUrl = $post->image_url;
            }

            $postId = $post->postID ?? $post->id;

            return [
                'id' => $postId,
                'userID' => $userID,
                'user_name' => $userName,
                'user_email' => $userEmail,
                'user_profile_photo' => $userProfilePhoto,
                'content' => $post->content,
                'image_url' => $imageUrl,
                'created_at' => $post->postDate ?? $post->created_at,
                'likes_count' => (int) ($likeCounts[$postId] ?? 0),
                'liked_by_user' => $likedByUser->has($postId),
            ];
        });

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'user_email' => ['required', 'email', 'max:100'],
                'content' => ['nullable', 'string', 'max:2000'],
                // max is in KB. 10240KB ~= 10MB
                'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
            ]);

            $user = User::where('email', $data['user_email'])->first();
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado',
                    'errors' => ['user_email' => ['El usuario no existe.']]
                ], 404);
            }

            if (empty($data['content']) && !$request->hasFile('image')) {
                return response()->json([
                    'message' => 'Debes escribir algo o subir una imagen para publicar.',
                    'errors' => ['content' => ['El contenido o la imagen es requerido.']]
                ], 422);
            }

            $imagePath = null;
            if ($request->hasFile('image')) {
                try {
                    $imagePath = $request->file('image')->store('posts', 'public');
                } catch (\Exception $e) {
                    \Log::error('Error al guardar imagen de publicación: ' . $e->getMessage());
                    return response()->json([
                        'message' => 'Error al guardar la imagen: ' . $e->getMessage(),
                        'errors' => ['image' => ['Error al guardar la imagen']]
                    ], 500);
                }
            }

            $post = Post::create([
                'userID' => $user->userID,
                'content' => $data['content'] ?? '',
                'postDate' => now(),
                'image' => $imagePath,
                'isActive' => true,
            ]);

            return response()->json([
                'id' => $post->postID ?? $post->id,
                'userID' => $post->userID,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'user_profile_photo' => $user->profilePhoto ? Storage::url($user->profilePhoto) : null,
                'content' => $post->content,
                'image_url' => $imagePath ? Storage::url($imagePath) : null,
                'created_at' => $post->postDate ?? $post->created_at,
                'likes_count' => 0,
                'liked_by_user' => true,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = $e->errors();
            $firstError = collect($errors)->flatten()->first();
            return response()->json([
                'message' => $firstError ?? 'Error de validación',
                'errors' => $errors
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la publicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $postId)
    {
        $validated = $request->validate([
            'user_email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['user_email'])->first();
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado',
            ], 404);
        }

        $post = Post::where('postID', $postId)->first();
        if (!$post) {
            return response()->json([
                'message' => 'Publicación no encontrada',
            ], 404);
        }

        if ((int) $post->userID !== (int) $user->userID) {
            return response()->json([
                'message' => 'Solo puedes eliminar tus propias publicaciones.',
            ], 403);
        }

        if ($post->image) {
            $imagePath = str_replace('/storage/', '', $post->image);
            Storage::disk('public')->delete($imagePath);
        }

        $post->delete();

        return response()->json([
            'message' => 'Publicación eliminada correctamente.',
        ]);
    }
}
