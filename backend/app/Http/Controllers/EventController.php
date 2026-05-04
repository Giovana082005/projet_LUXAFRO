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
}