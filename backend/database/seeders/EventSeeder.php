<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'musique',
            'sport',
            'culture',
            'danse',
            'festival'
        ];

        for ($i = 1; $i <= 30; $i++) {

            // heure début aléatoire
            $heureDebut = rand(8, 20); // entre 08h et 20h

            // heure fin (toujours après début)
            $heureFin = $heureDebut + rand(1, 3); // +1 à +3 heures

            Event::create([
                'nom' => 'Événement ' . $i,
                'description' => 'Description de l’événement ' . $i,

                'date' => now()->addDays(rand(1, 60)),

                'heure_debut' => sprintf('%02d:00', $heureDebut),
                'heure_fin' => sprintf('%02d:00', $heureFin),

                'lieu' => 'Nancy',

                'categories' => collect($categories)
                    ->random(rand(1, 3))
                    ->values()
                    ->toArray(),

                'pour_enfant' => rand(0, 1),

                'nombre_participants' => rand(10, 200),

                'tarif' => rand(0, 50),
            ]);
        }
    }
}