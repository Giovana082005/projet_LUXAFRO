<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/welcome', function () {
    return response()->json([
        'success' => true,
        'message' => 'Bienvenue sur l\'API Luxafro !',
        'data' => [
            'project' => 'Luxafro',
            'description' => 'Plateforme culturelle camerounaise',
            'version' => '1.0.0',
            'timestamp' => now()->toIso8601String(),
        ]
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');