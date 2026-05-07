<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UserController; 
use App\Http\Controllers\EventController;

Route::middleware(['web'])->group(function () {
    // Routes publiques d'authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes publiques de réinitialisation de mot de passe
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);


});


// Routes protégées
Route::middleware(['web', 'auth:sanctum'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);

    // ADMIN ONLY
    Route::middleware('admin')->group(function () {
       //CRUD Utilisateurs (admin)
        Route::get('/users', [UserController::class, 'index']);          
        Route::get('/users/{id}', [UserController::class, 'show']);      
        Route::put('/users/{id}', [UserController::class, 'update']);    
        Route::delete('/users/{id}', [UserController::class, 'destroy']); 

        //CRUD Événements (admin)
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);

        //Dashboard admin (route de test)
        Route::get('/admin', function () {
            return response()->json(['message' => 'Bienvenue admin']);
        });
    });

});