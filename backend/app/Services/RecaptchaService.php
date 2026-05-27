<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Vérifie les tokens reCAPTCHA v3 auprès de l'API Google.
 *
 * Usage :
 *   $recaptcha = new RecaptchaService();
 *   if (!$recaptcha->verify($token, 'contact_form')) {
 *       return response()->json(['message' => 'Vérification échouée'], 422);
 *   }
 */
class RecaptchaService
{
    private const GOOGLE_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

    /** Seuil minimum (0.0 = bot certain, 1.0 = humain certain) */
    private const MIN_SCORE = 0.5;

    /**
     * Vérifie un token reCAPTCHA v3.
     *
     * @param string $token       Token renvoyé par grecaptcha.execute() côté frontend
     * @param string $expectedAction Action attendue (ex: 'contact_form') — sécurité supplémentaire
     * @return bool true si la vérification passe, false sinon
     */
    public function verify(string $token, string $expectedAction): bool
    {
        // Token vide → on refuse direct
        if (empty($token)) {
            return false;
        }

        try {
            $response = Http::asForm()->post(self::GOOGLE_VERIFY_URL, [
                'secret'   => config('services.recaptcha.secret'),
                'response' => $token,
                'remoteip' => request()->ip(),
            ]);

            if (!$response->successful()) {
                Log::warning('reCAPTCHA: erreur réseau Google', [
                    'status' => $response->status(),
                ]);
                return false;
            }

            $data = $response->json();

            // Log pour debug pendant le développement
            Log::debug('reCAPTCHA response', $data);

            // Vérification basique : Google a-t-il validé le token ?
            if (!($data['success'] ?? false)) {
                return false;
            }

            // Vérification de l'action : protège contre la réutilisation
            //    d'un token d'un autre formulaire du site
            if (($data['action'] ?? null) !== $expectedAction) {
                Log::warning('reCAPTCHA: action invalide', [
                    'expected' => $expectedAction,
                    'received' => $data['action'] ?? null,
                ]);
                return false;
            }

            // Vérification du score : seuil configurable
            $score = $data['score'] ?? 0;
            if ($score < self::MIN_SCORE) {
                Log::info('reCAPTCHA: score trop bas', ['score' => $score]);
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('reCAPTCHA: exception', ['message' => $e->getMessage()]);
            return false;
        }
    }
}
