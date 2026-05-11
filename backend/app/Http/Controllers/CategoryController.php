<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // afficher toutes les catégories
    public function index()
    {
        return response()->json(Category::all());
    }

    // créer une catégorie
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|unique:categories,nom'
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'category' => $category
        ], 201);
    }

    public function destroy($id)
{
    $category = Category::find($id);

    if (!$category) {

        return response()->json([
            'message' => 'Catégorie non trouvée'
        ], 404);
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer les relations pivot
    |--------------------------------------------------------------------------
    */

    $category->events()->detach();

    /*
    |--------------------------------------------------------------------------
    | Supprimer catégorie
    |--------------------------------------------------------------------------
    */

    $category->delete();

    return response()->json([
        'message' => 'Catégorie supprimée avec succès'
    ]);
}
}