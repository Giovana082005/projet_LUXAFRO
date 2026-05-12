<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * INSCRIPTION
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // connexion utilisateur
        Auth::login($user);

        // régénération session
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user,
        ], 201);
    }

    /**
     * CONNEXION
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        // tentative connexion
        if (!Auth::attempt(
            $request->only('email', 'password')
        )) {

            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects'],
            ]);
        }

        // régénération session
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => Auth::user(),
        ]);
    }

    /**
     * UTILISATEUR CONNECTÉ
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * DÉCONNEXION
     */
    public function logout(Request $request)
    {
        // déconnexion session
        Auth::guard('web')->logout();

        // invalider session
        $request->session()->invalidate();

        // régénérer token csrf
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
}