<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventPhotoController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES
|--------------------------------------------------------------------------
*/

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// PASSWORD
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// CATÉGORIES
Route::get('/categories', [CategoryController::class, 'index']);

// CONTACT
Route::post('/contact', [ContactController::class, 'store']);

// PLACES RESTANTES
Route::get('/events/{id}/places-restantes', [ReservationController::class, 'placesRestantes']);

/*
|--------------------------------------------------------------------------
| ROUTES PROTÉGÉES
|--------------------------------------------------------------------------
*/

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    // AUTH
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // EVENTS
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);

    // RÉSERVATIONS
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {

        // UTILISATEURS
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // ÉVÉNEMENTS
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);
        Route::post('/events/{id}/categories', [EventController::class, 'addCategories']);

        // CATÉGORIES
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // PHOTOS
        Route::post('/events/{id}/photos', [EventPhotoController::class, 'store']);
        Route::delete('/photos/{id}', [EventPhotoController::class, 'destroy']);

        // CONTACT MESSAGES
        Route::get('/contact-messages', [ContactController::class, 'index']);
        Route::put('/contact-messages/{id}/read', [ContactController::class, 'markAsRead']);
        Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy']);

        // TEST ADMIN
        Route::get('/admin', function () {
            return response()->json([
                'message' => 'Bienvenue admin'
            ]);
        });
    });
});