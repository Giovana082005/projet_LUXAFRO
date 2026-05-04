<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Illuminate\Support\Str;

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

            Event::create([
                'nom' => 'Événement ' . $i,
                'description' => 'Description de l’événement ' . $i,

                'date' => now()->addDays(rand(1, 60)),
                'horaire' => now()->format('H:i'),

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