<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\Reservation;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', User::ROLE_USER)->get();

        $events = Event::all();

        /*
        |--------------------------------------------------------------------------
        | Création réservations
        |--------------------------------------------------------------------------
        */

        for ($i = 1; $i <= 200; $i++) {

            $event = $events->random();

            $nbAdultes = rand(1, 5);

            $nbEnfants = rand(0, 3);

            $total = $nbAdultes + $nbEnfants;

            // éviter dépassement capacité
            if ($total > $event->nombre_participants) {
                continue;
            }

            Reservation::create([

                'user_id' => $users->random()->id,

                'event_id' => $event->id,

                'nb_adultes' => $nbAdultes,

                'nb_enfants' => $nbEnfants,

                'total_price' => $event->tarif * $total,

                'status' => collect([
                    Reservation::STATUS_PENDING,
                    Reservation::STATUS_CONFIRMED,
                    Reservation::STATUS_PAID,
                    Reservation::STATUS_CANCELLED
                ])->random(),

                'payment_method' => collect([
                    'on_site',
                    'qr_code'
                ])->random(),
            ]);
        }
    }
}
