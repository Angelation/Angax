<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\RoutineController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\WorkoutSessionController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me']);

Route::get('/routines', [RoutineController::class, 'index']);
Route::post('/routines', [RoutineController::class, 'store']);
Route::delete('/routines/{id}', [RoutineController::class, 'destroy']);
Route::post('/routines/{id}/complete', [RoutineController::class, 'complete']);
Route::get('/exercises', [RoutineController::class, 'getAvailableExercises']);

Route::get('/sessions', [WorkoutSessionController::class, 'index']);
Route::post('/sessions', [WorkoutSessionController::class, 'store']);

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);

Route::get('/comments', [CommentController::class, 'index']);
Route::post('/comments', [CommentController::class, 'store']);
Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
Route::post('/comments/{id}/like', [CommentController::class, 'toggleLike']);

Route::post('/likes/toggle', [LikeController::class, 'toggle']);

Route::get('/profile', [ProfileController::class, 'show']);
Route::post('/profile', [ProfileController::class, 'update']);
Route::get('/progress', [ProfileController::class, 'getProgress']);
Route::get('/suggested-users', [ProfileController::class, 'getSuggestedUsers']);

Route::post('/follow/toggle', [\App\Http\Controllers\Api\FollowController::class, 'toggle']);
Route::get('/follow/check', [\App\Http\Controllers\Api\FollowController::class, 'check']);

Route::get('/trainer/clients', [TrainerController::class, 'getClients']);
Route::get('/trainer/available-users', [TrainerController::class, 'getAvailableUsers']);
Route::post('/trainer/add-client', [TrainerController::class, 'addClient']);
Route::post('/trainer/remove-client', [TrainerController::class, 'removeClient']);
Route::get('/trainer/available-trainers', [TrainerController::class, 'getAvailableTrainers']);
Route::get('/trainer/my-trainer', [TrainerController::class, 'getMyTrainer']);
Route::post('/trainer/join', [TrainerController::class, 'joinTrainer']);
Route::post('/trainer/leave', [TrainerController::class, 'leaveTrainer']);
Route::get('/trainer/student-progress', [TrainerController::class, 'getStudentProgress']);
Route::get('/trainer/my-routines', [TrainerController::class, 'getTrainerRoutines']);

