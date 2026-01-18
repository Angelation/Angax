<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class AdminController extends Controller
{
    public function getUsers(Request $request)
    {
        try {
            $adminEmail = $request->query('admin_email');
            
            if (!$adminEmail) {
                return response()->json(['message' => 'Email de administrador requerido'], 400);
            }

            $admin = User::where('email', $adminEmail)->where('role', 'admin')->first();
            if (!$admin) {
                return response()->json(['message' => 'No tienes permisos de administrador'], 403);
            }

            $users = User::where('role', '!=', 'admin')
                ->select('userID', 'name', 'email', 'role', 'registerDate', 'isActive', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'users' => $users,
                'count' => $users->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener usuarios: ' . $e->getMessage());
            return response()->json(['message' => 'Error al obtener usuarios'], 500);
        }
    }

    public function deleteUser(Request $request, $id)
    {
        try {
            $adminEmail = $request->input('admin_email');
            
            if (!$adminEmail) {
                return response()->json(['message' => 'Email de administrador requerido'], 400);
            }

            $admin = User::where('email', $adminEmail)->where('role', 'admin')->first();
            if (!$admin) {
                return response()->json(['message' => 'No tienes permisos de administrador'], 403);
            }

            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            if ($user->role === 'admin') {
                return response()->json(['message' => 'No se puede eliminar un administrador'], 403);
            }

            // Eliminar relaciones antes de eliminar el usuario
            DB::table('posts')->where('userID', $id)->delete();
            DB::table('comments')->where('userID', $id)->delete();
            DB::table('likes')->where('userID', $id)->delete();
            DB::table('routines')->where('userID', $id)->delete();
            DB::table('trainers_clients')->where('trainerID', $id)->orWhere('clientID', $id)->delete();
            DB::table('follows')->where('followerID', $id)->orWhere('followingID', $id)->delete();

            $user->delete();

            return response()->json(['message' => 'Usuario eliminado exitosamente']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar usuario'], 500);
        }
    }

    public function deleteComment(Request $request, $id)
    {
        try {
            $adminEmail = $request->input('admin_email');
            
            if (!$adminEmail) {
                return response()->json(['message' => 'Email de administrador requerido'], 400);
            }

            $admin = User::where('email', $adminEmail)->where('role', 'admin')->first();
            if (!$admin) {
                return response()->json(['message' => 'No tienes permisos de administrador'], 403);
            }

            $comment = Comment::find($id);
            if (!$comment) {
                return response()->json(['message' => 'Comentario no encontrado'], 404);
            }

            // Eliminar respuestas primero (si existe la columna parentID)
            if (Schema::hasColumn('comments', 'parentID')) {
                DB::table('comments')->where('parentID', $id)->delete();
            }
            
            $comment->delete();

            return response()->json(['message' => 'Comentario eliminado exitosamente']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar comentario: ' . $e->getMessage());
            return response()->json(['message' => 'Error al eliminar comentario'], 500);
        }
    }
}

