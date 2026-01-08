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

        if ($follower->userID === $following->userID) {
            return response()->json(['message' => 'No puedes seguirte a ti mismo'], 400);
        }

        $follow = Follow::where('followerID', $follower->userID)
            ->where('followingID', $following->userID)
            ->first();

        if ($follow) {
            $follow->delete();
            $isFollowing = false;
        } else {
            Follow::create([
                'followerID' => $follower->userID,
                'followingID' => $following->userID,
            ]);
            $isFollowing = true;
        }

        // Verificar si se siguen mutuamente
        $mutualFollow = Follow::where('followerID', $following->userID)
            ->where('followingID', $follower->userID)
            ->exists();

        // Obtener contadores actualizados
        $followersCount = Follow::where('followingID', $following->userID)->count();
        $followingCount = Follow::where('followerID', $following->userID)->count();

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

        $isFollowing = Follow::where('followerID', $follower->userID)
            ->where('followingID', $following->userID)
            ->exists();

        $mutualFollow = Follow::where('followerID', $following->userID)
            ->where('followingID', $follower->userID)
            ->exists();

        return response()->json([
            'is_following' => $isFollowing,
            'is_mutual' => $isFollowing && $mutualFollow,
        ]);
    }
}
