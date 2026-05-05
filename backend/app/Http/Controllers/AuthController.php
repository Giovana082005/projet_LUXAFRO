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

        // Connecter automatiquement l'utilisateur après inscription
        Auth::login($user);

        // Régénérer la session pour la sécurité
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

        //Tenter la connexion via Auth
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        //Régénérer la session pour la sécurité
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => Auth::user(),
        ]);
    }

    /**
     * RÉCUPÉRER L'UTILISATEUR CONNECTÉ
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
        //Déconnecter l'utilisateur
        Auth::guard('web')->logout();

        //Invalider la session
        $request->session()->invalidate();

        //Régénérer le token CSRF
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
}