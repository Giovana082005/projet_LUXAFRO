<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'nb_adultes' => 'required|integer|min:1',
            'nb_enfants' => 'required|integer|min:0',
            'payment_method' => 'required|in:on_site,qr_code'
        ]);

        $event = Event::findOrFail($request->event_id);

        // calcul total places
        $total_personnes = $request->nb_adultes + $request->nb_enfants;

        // calcul prix (enfants payent aussi)
        $total_price = $event->tarif * $total_personnes;

        // statut initial
        $status = 'pending';

        $reservation = Reservation::create([
            'user_id' => auth()->id(),
            'event_id' => $event->id,
            'nb_adultes' => $request->nb_adultes,
            'nb_enfants' => $request->nb_enfants,
            'total_price' => $total_price,
            'status' => $status,
            'payment_method' => $request->payment_method,
        ]);

        return response()->json([
            'message' => 'Réservation créée avec succès',
            'reservation' => $reservation
        ]);
    }

    public function placesRestantes($eventId)
    {
    $event = Event::findOrFail($eventId);

    $reservees = Reservation::where('event_id', $eventId)
        ->where('statut', '!=', 'cancelled')
        ->sum(DB::raw('places_adultes + places_enfants'));

    return $event->capacite_totale - $reservees;
    }
}