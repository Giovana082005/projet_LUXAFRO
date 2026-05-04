<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Demande de réinitialisation de mot de passe
     * génèration d' un token et  envoie d'un email
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Vérifier si un token existe déjà pour cet email
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Générer un nouveau token
        $token = Str::random(64);

        // Stocker en BDD
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token), // On hash le token 
            'created_at' => now(),
        ]);

        // Récupérer l'utilisateur
        $user = User::where('email', $request->email)->first();

        // Construire le lien de réinitialisation
        $resetLink = config('app.frontend_url', 'http://localhost:5173') 
                   . '/reset-password?token=' . $token 
                   . '&email=' . urlencode($request->email);

        // Envoyer l'email
        Mail::to($request->email)->send(new PasswordResetMail($user, $resetLink));

        return response()->json([
            'message' => 'Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.',
        ]);
    }

    /**
     * Réinitialisation effective
     * L'utilisateur arrive sur la page reset avec le token
     * Il entre son nouveau mot de passe
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Récupérer le token en BDD
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Token invalide ou expiré.',
            ], 400);
        }

        // Vérifier que le token correspond
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Token invalide.',
            ], 400);
        }

        // Vérifier que le token n'est pas expiré (1h max)
        $tokenCreatedAt = \Carbon\Carbon::parse($resetRecord->created_at);
        if ($tokenCreatedAt->diffInMinutes(now()) > 60) {
            // Supprimer le token expiré
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Le lien de réinitialisation a expiré. Demandez un nouveau lien.',
            ], 400);
        }

        // Mettre à jour le mot de passe
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token: usage unique
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        //supprimer tous les tokens Sanctum existants
        //pour forcer la reconnexion sur tous les appareils
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.',
        ]);
    }
}