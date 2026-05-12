<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    /**
     * ENVOYER MESSAGE CONTACT
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'nom' => 'required|string|max:255',

            'email' => 'required|email',

            'raison' => 'required|string|max:255',

            'message' => 'required|string|max:5000',
        ]);

        $message = ContactMessage::create($validated);

        return response()->json([

            'message' =>
                'Message envoyé avec succès',

            'data' => $message

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
     * MARQUER COMME LU
     */
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);

        $message->update([
            'is_read' => true
        ]);

        return response()->json([
            'message' => 'Message marqué comme lu'
        ]);
    }

    /**
     * SUPPRIMER MESSAGE
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);

        $message->delete();

        return response()->json([
            'message' => 'Message supprimé'
        ]);
    }

        /**
     * LISTE DES MESSAGES
     */
    public function getContacts()
    {
        $messages = ContactMessage::latest()->get();

        return response()->json($messages);
    }

    /**
     * DÉTAIL D’UN MESSAGE
     */
    public function getContactDetails($id)
    {
        $message = ContactMessage::findOrFail($id);

        return response()->json($message);
    }
}