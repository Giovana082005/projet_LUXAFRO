<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * CRÉER UNE RÉSERVATION
     */
    public function store(Request $request)
    {
        $request->validate([

            'event_id' => 'required|exists:events,id',

            'nb_adultes' => 'required|integer|min:1',

            'nb_enfants' => 'required|integer|min:0',

            'payment_method' => 'required|in:on_site,qr_code'
        ]);

        /*
        |--------------------------------------------------------------------------
        | Récupération événement
        |--------------------------------------------------------------------------
        */

        $event = Event::findOrFail($request->event_id);

        /*
        |--------------------------------------------------------------------------
        | Nombre total de personnes
        |--------------------------------------------------------------------------
        */

        $totalPersonnes =
            $request->nb_adultes +
            $request->nb_enfants;

        /*
        |--------------------------------------------------------------------------
        | Vérification places restantes
        |--------------------------------------------------------------------------
        */

        $placesRestantes = $this->placesRestantes($event->id);

        if ($totalPersonnes > $placesRestantes) {

            return response()->json([
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | Calcul prix total
        |--------------------------------------------------------------------------
        */

        $totalPrice =
            $event->tarif * $totalPersonnes;

        /*
        |--------------------------------------------------------------------------
        | Statut réservation
        |--------------------------------------------------------------------------
        */

        $status = $totalPrice == 0
            ? Reservation::STATUS_PAID
            : Reservation::STATUS_PENDING;

        /*
        |--------------------------------------------------------------------------
        | Création réservation
        |--------------------------------------------------------------------------
        */

        $reservation = Reservation::create([

            'user_id' => auth()->id(),

            'event_id' => $event->id,

            'nb_adultes' => $request->nb_adultes,

            'nb_enfants' => $request->nb_enfants,

            'total_price' => $totalPrice,

            'status' => $status,

            'payment_method' => $request->payment_method,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Réponse
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'message' => 'Réservation créée avec succès',

            'reservation' => $reservation

        ], 201);
    }

    /**
     * PLACES RESTANTES
     */
    public function placesRestantes($eventId)
    {
        $event = Event::findOrFail($eventId);

        $reservees = Reservation::where('event_id', $eventId)

            ->where('status', '!=', Reservation::STATUS_CANCELLED)

            ->sum(DB::raw(
                'nb_adultes + nb_enfants'
            ));

        return $event->capacite_totale - $reservees;
    }

    /**
     * MES RÉSERVATIONS
     */
    public function myReservations()
    {
        $reservations = Reservation::with('event')

            ->where('user_id', auth()->id())

            ->latest()

            ->get();

        return response()->json($reservations);
    }

    /**
     * DÉTAIL D’UNE RÉSERVATION
     */
    public function show($id)
    {
        $reservation = Reservation::with([
            'event',
            'user'
        ])->findOrFail($id);

        return response()->json($reservation);
    }

    /**
     * ANNULER UNE RÉSERVATION
     */
    public function cancel($id)
    {
        $reservation = Reservation::findOrFail($id);

        $reservation->update([
            'status' => Reservation::STATUS_CANCELLED
        ]);

        return response()->json([
            'message' => 'Réservation annulée'
        ]);
    }
}