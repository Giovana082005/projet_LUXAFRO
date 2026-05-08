<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventPhotoController;
/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES
|--------------------------------------------------------------------------
*/

Route::middleware(['web'])->group(function () {

    // AUTH
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // PASSWORD
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

    // EVENTS (PUBLIC)
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);

    //RESERVATIONS 
    Route::post('/reservations', [ReservationController::class, 'store']);
});


/*
|--------------------------------------------------------------------------
| ROUTES PROTÉGÉES
|--------------------------------------------------------------------------
*/

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ADMIN ONLY
    Route::middleware('admin')->group(function () {

        // CRUD Utilisateurs
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // CRUD Événements
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);
        Route::post('/events/{id}/categories', [EventController::class, 'addCategories']);
        Route::post('/events/{id}/photos', [EventPhotoController::class, 'store']);
        Route::delete('/photos/{id}', [EventPhotoController::class, 'destroy']);

        Route::get('/admin', function () {
            return response()->json([
                'message' => 'Bienvenue admin'
            ]);
        });
    });
});