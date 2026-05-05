<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Event::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'horaire' => 'required',
            'lieu' => 'required|string',
            'categories' => 'array',
            'categories.*' => 'in:musique,sport,culture,danse,festival',
            'pour_enfant' => 'boolean',
            'nombre_participants' => 'nullable|integer',
            'tarif' => 'nullable|numeric',
        ]);

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

     public function show($id)
    {
        // Récupérer l'événement ou erreur 404
        $event = Event::find($id);

        // Si l'événement n'existe pas
        if (!$event) {
            return response()->json([
                'message' => 'Événement non trouvé'
            ], 404);
        }

        // Retourner l'événement
        return response()->json($event, 200);
    }

    public function destroy($id)
    {
    $event = Event::find($id);

    if (!$event) {
        return response()->json([
            'message' => 'Événement non trouvé'
        ], 404);
    }

    $event->delete();

    return response()->json([
        'message' => 'Événement supprimé avec succès'
    ]);
    }
}