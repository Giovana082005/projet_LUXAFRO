<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LISTE + FILTRES
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $query = Event::with(['photos', 'categories']);

        // recherche par nom
        if ($request->filled('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        // filtre par catégorie
        if ($request->filled('category')) {

            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('nom', $request->category);
            });
        }

        // filtre enfant
        if ($request->filled('child')) {
            $query->where('pour_enfant', true);
        }

        return response()->json($query->get());
    }

    /*
    |--------------------------------------------------------------------------
    | CRÉATION
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'description' => 'required|string',

            'date' => 'required|date',

            'heure_debut' => 'required',

            'heure_fin' => 'nullable|after:heure_debut',

            'lieu' => 'required|string',

            'pour_enfant' => 'boolean',

            'nombre_participants' => 'nullable|integer',

            'tarif' => 'nullable|numeric',
        ]);

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    /*
    |--------------------------------------------------------------------------
    | DÉTAIL
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $event = Event::with(['photos', 'categories'])->find($id);

        if (!$event) {

            return response()->json([
                'message' => 'Événement non trouvé'
            ], 404);
        }

        return response()->json($event);
    }

    /*
    |--------------------------------------------------------------------------
    | MODIFICATION
    |--------------------------------------------------------------------------
    */

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

            'pour_enfant' => 'boolean',

            'nombre_participants' => 'nullable|integer',

            'tarif' => 'nullable|numeric',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    /*
    |--------------------------------------------------------------------------
    | SUPPRESSION
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | AJOUTER DES CATÉGORIES
    |--------------------------------------------------------------------------
    */

    public function addCategories(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'categories' => 'required|array',

            // ids des catégories
            'categories.*' => 'exists:categories,id'
        ]);

        // ajoute sans supprimer les anciennes
        $event->categories()->syncWithoutDetaching(
            $validated['categories']
        );

        return response()->json([
            'message' => 'Catégories ajoutées avec succès',

            'categories' => $event->categories
        ]);
    }
   
}