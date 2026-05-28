<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;
use App\Services\RecaptchaService;

class ContactController extends Controller
{
    public function __construct(
        private RecaptchaService $recaptcha
    ) {}

    /**
     * ENVOYER MESSAGE CONTACT (public, protégé par reCAPTCHA)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'             => 'required|string|max:255',
            'email'           => 'required|email',
            'raison'          => 'required|string|max:255',
            'message'         => 'required|string|max:5000',
            'recaptcha_token' => 'required|string',
        ]);

        // Vérification reCAPTCHA AVANT toute action
        if (!$this->recaptcha->verify($validated['recaptcha_token'], 'contact_form')) {
            return response()->json([
                'message' => 'Vérification de sécurité échouée. Veuillez réessayer.',
            ], 422);
        }

        // On ne stocke pas le token reCAPTCHA en base
        unset($validated['recaptcha_token']);

        $message = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Message envoyé avec succès',
            'contact' => $message,
        ], 201);
    }
    /**
     * LISTE DES MESSAGES (admin)
     */

    public function index()
    {
        return response()->json(ContactMessage::latest()->get());
    }
    /**
     * DÉTAIL D'UN MESSAGE (admin)
     */

    public function getContactDetails($id)
    {
        return response()->json(ContactMessage::findOrFail($id));
    }
    
    /**
     * TOGGLE lu / non-lu (admin)
     * Inverse l'état actuel pour permettre les deux sens.
     */

    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => !$message->is_read]);

        return response()->json([
            'message' => $message->is_read
                ? 'Message marqué comme lu'
                : 'Message marqué comme non lu',
            'contact' => $message,
        ]);
    }
     /**
     * SUPPRIMER MESSAGE (admin)
     */


    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Message supprimé']);
    }
}