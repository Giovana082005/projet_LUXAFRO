<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventPhotoController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES
|--------------------------------------------------------------------------
*/

// CATÉGORIES
Route::get('/categories', [CategoryController::class, 'index']);

// PLACES RESTANTES
Route::get('/events/{id}/places-restantes', [ReservationController::class, 'placesRestantes']);

/*
|--------------------------------------------------------------------------
| ROUTES AVEC SESSIONS WEB
|--------------------------------------------------------------------------
*/

Route::middleware('web')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | PASSWORD
    |--------------------------------------------------------------------------
    */

    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);

    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

/*
|--------------------------------------------------------------------------
| ROUTES PROTÉGÉES
|--------------------------------------------------------------------------
*/

Route::middleware(['web', 'auth:sanctum'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | EVENTS
    |--------------------------------------------------------------------------
    */

    Route::get('/events', [EventController::class, 'index']);

    Route::get('/events/{id}', [EventController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | RÉSERVATIONS
    |--------------------------------------------------------------------------
    */

    // créer une réservation
    Route::post('/reservations', [ReservationController::class, 'store']);

    // mes réservations
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);

    // détail réservation
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);

    // annuler réservation
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        */

        Route::get('/users', [UserController::class, 'index']);

        Route::get('/users/{id}', [UserController::class, 'show']);

        Route::put('/users/{id}', [UserController::class, 'update']);

        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | EVENTS
        |--------------------------------------------------------------------------
        */

        Route::post('/events', [EventController::class, 'store']);

        Route::put('/events/{id}', [EventController::class, 'update']);

        Route::delete('/events/{id}', [EventController::class, 'destroy']);

        Route::post('/events/{id}/categories', [EventController::class, 'addCategories']);

        /*
        |--------------------------------------------------------------------------
        | CATEGORIES
        |--------------------------------------------------------------------------
        */

        Route::post('/categories', [CategoryController::class, 'store']);

        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | PHOTOS
        |--------------------------------------------------------------------------
        */

        Route::post('/events/{id}/photos', [EventPhotoController::class, 'store']);

        Route::delete('/photos/{id}', [EventPhotoController::class, 'destroy']);

        /*
        |--------------------------------------------------------------------------
        | TEST ADMIN
        |--------------------------------------------------------------------------
        */

        Route::get('/admin', function () {

            return response()->json([
                'message' => 'Bienvenue admin'
            ]);
        });
    });
});