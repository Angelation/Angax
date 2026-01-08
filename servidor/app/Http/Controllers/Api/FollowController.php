<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function toggle(Request $request)
    {
        $data = $request->validate([
            'follower_email' => ['required', 'email', 'exists:users,email'],
            'following_email' => ['required', 'email', 'exists:users,email'],
        ]);

        $follower = User::where('email', $data['follower_email'])->first();
        $following = User::where('email', $data['following_email'])->first();

        if ($follower->id === $following->id) {
            return response()->json(['message' => 'No puedes seguirte a ti mismo'], 400);
        }

        $follow = Follow::where('followerID', $follower->id)
            ->where('followingID', $following->id)
            ->first();

        if ($follow) {
            $follow->delete();
            $isFollowing = false;
        } else {
            Follow::create([
                'followerID' => $follower->id,
                'followingID' => $following->id,
            ]);
            $isFollowing = true;
        }

        // Verificar si se siguen mutuamente
        $mutualFollow = Follow::where('followerID', $following->id)
            ->where('followingID', $follower->id)
            ->exists();

        // Obtener contadores actualizados
        $followersCount = Follow::where('followingID', $following->id)->count();
        $followingCount = Follow::where('followerID', $following->id)->count();

        return response()->json([
            'is_following' => $isFollowing,
            'is_mutual' => $mutualFollow && $isFollowing,
            'followers_count' => $followersCount,
            'following_count' => $followingCount,
        ]);
    }

    public function check(Request $request)
    {
        $data = $request->validate([
            'follower_email' => ['required', 'email', 'exists:users,email'],
            'following_email' => ['required', 'email', 'exists:users,email'],
        ]);

        $follower = User::where('email', $data['follower_email'])->first();
        $following = User::where('email', $data['following_email'])->first();

        $isFollowing = Follow::where('followerID', $follower->id)
            ->where('followingID', $following->id)
            ->exists();

        $mutualFollow = Follow::where('followerID', $following->id)
            ->where('followingID', $follower->id)
            ->exists();

        return response()->json([
            'is_following' => $isFollowing,
            'is_mutual' => $isFollowing && $mutualFollow,
        ]);
    }
}
