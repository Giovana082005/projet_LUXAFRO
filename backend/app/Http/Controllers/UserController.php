<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Liste TOUS les utilisateurs (admins + utilisateurs)
     * Les soft-deleted sont automatiquement exclus 
     */
    public function index()
    {
        return response()->json(
            User::orderBy('created_at', 'desc')->get()
        );
    }

    /**
     *GET /api/users/{id}
     * Affiche le détail d'un utilisateur
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        return response()->json($user);
    }

    /**
     *PUT /api/users/{id}
     * Met à jour un utilisateur (notamment son rôle)
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        //Vérifier que l'utilisateur existe
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        //PROTECTION 1 : Un admin ne peut pas se rétrograder lui-même
        //(sinon il pourrait perdre ses droits par erreur)
        if ($request->user()->id === $user->id && $request->has('role') && $request->role !== User::ROLE_ADMIN) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre rôle administrateur'
            ], 403);
        }

        //Validation des données reçues
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:' . User::ROLE_USER . ',' . User::ROLE_ADMIN,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        //Mise à jour
        $user->update($validator->validated());

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * DELETE /api/users/{id}
     * Soft delete d'un utilisateur (réversible)
     */
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        //PROTECTION 2 : Un admin ne peut pas se supprimer lui-même
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            ], 403);
        }

        //Soft delete (ajoute juste deleted_at, ne supprime pas vraiment)
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}