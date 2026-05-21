<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    /**
     * ENVOYER MESSAGE CONTACT (public)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'     => 'required|string|max:255',
            'email'   => 'required|email',
            'raison'  => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

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
        return response()->json(
            ContactMessage::latest()->get()
        );
    }

    /**
     * DÉTAIL D'UN MESSAGE (admin)
     */
    public function getContactDetails($id)
    {
        $message = ContactMessage::findOrFail($id);

        return response()->json($message);
    }

    /**
     * TOGGLE lu / non-lu (admin)
     * Inverse l'état actuel pour permettre les deux sens.
     */
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);

        $message->update([
            'is_read' => !$message->is_read,
        ]);

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

        return response()->json([
            'message' => 'Message supprimé',
        ]);
    }
}