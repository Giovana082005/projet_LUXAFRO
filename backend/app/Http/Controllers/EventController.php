<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    //LISTE + FILTRES
    public function index(Request $request)
    {
        $query = Event::query();

        // recherche par nom
        if ($request->filled('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        // filtre catégories (JSON)
        if ($request->filled('category')) {
            $query->whereJsonContains('categories', $request->category);
        }

        // filtre enfant
        if ($request->filled('child')) {
            $query->where('pour_enfant', true);
        }

        return response()->json($query->get());
    }

    // CRÉATION
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',

            'heure_debut' => 'required',
            'heure_fin' => 'nullable|after:heure_debut',

            'lieu' => 'required|string',
            'categories' => 'array',
            'pour_enfant' => 'boolean',
            'nombre_participants' => 'nullable|integer',
            'tarif' => 'nullable|numeric',
        ]);

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    //  DÉTAIL
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Événement non trouvé'
            ], 404);
        }

        return response()->json($event, 200);
    }

    //  SUPPRESSION
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

    // MODIFICATION
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',

            'heure_debut' => 'required',
            'heure_fin' => 'nullable|after:heure_debut',

            'lieu' => 'required|string',
            'categories' => 'array',
            
            'categories.*' => Rule::in(Event::CATEGORIES),
            'pour_enfant' => 'boolean',
            'nombre_participants' => 'nullable|integer',
            'tarif' => 'nullable|numeric',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function addCategories(Request $request, $id)
{
    $event = Event::findOrFail($id);

    $validated = $request->validate([
        'categories' => 'required|array',
        'categories.*' => 'string'
    ]);

    // récupérer les catégories existantes (ou tableau vide)
    $existing = $event->categories ?? [];

    // fusion sans doublons
    $newCategories = array_unique(array_merge($existing, $validated['categories']));

    // sauvegarde
    $event->categories = $newCategories;
    $event->save();

    return response()->json([
        'message' => 'Catégories ajoutées avec succès',
        'categories' => $event->categories
    ]);
}
}