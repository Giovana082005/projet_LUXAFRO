<?php

namespace App\Http\Controllers;

use App\Events\EventReservationUpdated;
use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | CRÉER UNE RÉSERVATION
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'nb_adultes' => 'required|integer|min:1',
            'nb_enfants' => 'required|integer|min:0',
            'payment_method' => 'required|in:on_site,qr_code'
        ]);

        try {

            $eventUpdated = null;

            $reservation = DB::transaction(function () use ($request, &$eventUpdated) {

                /*
                |--------------------------------------------------------------------------
                | LOCK EVENT (anti-concurrence)
                |--------------------------------------------------------------------------
                */
                $event = Event::where('id', $request->event_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $totalPersonnes =
                    $request->nb_adultes +
                    $request->nb_enfants;

                /*
                |--------------------------------------------------------------------------
                | Vérification places
                |--------------------------------------------------------------------------
                */
                if ($totalPersonnes > $event->places_restantes) {
                    throw new \Exception('Pas assez de places disponibles');
                }

                /*
                |--------------------------------------------------------------------------
                | UPDATE places
                |--------------------------------------------------------------------------
                */
                $event->reserved_places += $totalPersonnes;
                $event->save();

                $eventUpdated = $event;

                /*
                |--------------------------------------------------------------------------
                | CREATE reservation
                |--------------------------------------------------------------------------
                */
                return Reservation::create([
                    'user_id' => auth()->id(),
                    'event_id' => $event->id,
                    'nb_adultes' => $request->nb_adultes,
                    'nb_enfants' => $request->nb_enfants,
                    'total_price' => $event->tarif * $totalPersonnes,
                    'status' => Reservation::STATUS_PENDING,
                    'payment_method' => $request->payment_method,
                ]);
            });

            /*
            |--------------------------------------------------------------------------
            | BROADCAST après transaction
            |--------------------------------------------------------------------------
            */
            broadcast(new EventReservationUpdated($eventUpdated));

            return response()->json([
                'message' => 'Réservation créée avec succès',
                'reservation' => $reservation
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MES RÉSERVATIONS
    |--------------------------------------------------------------------------
    */
    public function myReservations()
    {
        return Reservation::with('event')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | DÉTAIL RÉSERVATION
    |--------------------------------------------------------------------------
    */
    public function show($id)
    {
        return Reservation::with(['event', 'user'])
            ->findOrFail($id);
    }

    /*
    |--------------------------------------------------------------------------
    | ANNULER RÉSERVATION
    |--------------------------------------------------------------------------
    */
    public function cancel($id)
    {
        try {

            DB::transaction(function () use ($id) {

                $reservation = Reservation::findOrFail($id);

                if ($reservation->status === Reservation::STATUS_CANCELLED) {
                    throw new \Exception('Réservation déjà annulée');
                }

                $event = Event::where('id', $reservation->event_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $totalPersonnes =
                    $reservation->nb_adultes +
                    $reservation->nb_enfants;

                $event->reserved_places -= $totalPersonnes;

                if ($event->reserved_places < 0) {
                    $event->reserved_places = 0;
                }

                $event->save();

                $reservation->update([
                    'status' => Reservation::STATUS_CANCELLED
                ]);

                broadcast(new EventReservationUpdated($event));
            });

            return response()->json([
                'message' => 'Réservation annulée'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}