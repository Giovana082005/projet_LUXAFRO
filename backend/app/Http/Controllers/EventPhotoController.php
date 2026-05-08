<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventPhotoController extends Controller
{
    /**
     * AJOUTER UNE PHOTO
     */
    public function store(Request $request, $eventId)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $event = Event::findOrFail($eventId);

        $path = $request->file('photo')->store('events', 'public');

        $photo = EventPhoto::create([
            'event_id' => $event->id,
            'image_path' => $path,
        ]);

        return response()->json([
            'message' => 'Photo ajoutée avec succès',
            'photo' => $photo,
        ], 201);
    }

    /**
     * SUPPRIMER UNE PHOTO
     */
    public function destroy($id)
    {
        $photo = EventPhoto::findOrFail($id);

        // supprimer le fichier physique
        if (
            $photo->image_path &&
            Storage::disk('public')->exists($photo->image_path)
        ) {
            Storage::disk('public')->delete($photo->image_path);
        }

        // supprimer en base
        $photo->delete();

        return response()->json([
            'message' => 'Photo supprimée avec succès'
        ]);
    }
}