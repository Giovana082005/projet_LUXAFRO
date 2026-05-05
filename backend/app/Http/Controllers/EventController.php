<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
         $query = Event::query();

        // recherche par nom
        if ($request->filled('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        //  filtre catégories (JSON)
        if ($request->filled('category')) {
            $query->whereJsonContains('categories', $request->category);
        }

        // filtre enfant
        if ($request->filled('child')) {
            $query->where('pour_enfant', true);
        }
        return response()->json($query->get());
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

    public function update(Request $request, $id)
    {
    $event = Event::findOrFail($id);

    $validated = $request->validate([
        'nom' => 'required|string',
        'description' => 'required|string',
        'date' => 'required|date',
        'horaire' => 'required',
        'lieu' => 'required|string',
        'categories' => 'array',
        'pour_enfant' => 'boolean',
        'nombre_participants' => 'nullable|integer',
        'tarif' => 'nullable|numeric',
    ]);

    $event->update($validated);

    return response()->json($event);
    }
}