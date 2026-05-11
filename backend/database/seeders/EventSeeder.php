<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Category;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Création des catégories
        |--------------------------------------------------------------------------
        */

        $categories = [
            'musique',
            'sport',
            'culture',
            'danse',
            'festival'
        ];

        foreach ($categories as $nom) {

            Category::firstOrCreate([
                'nom' => $nom
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Création des événements
        |--------------------------------------------------------------------------
        */

        for ($i = 1; $i <= 30; $i++) {

            // heure début aléatoire
            $heureDebut = rand(8, 20);

            // heure fin après début
            $heureFin = $heureDebut + rand(1, 3);

            // création événement
            $event = Event::create([

                'nom' => 'Événement ' . $i,

                'description' => 'Description de l’événement ' . $i,

                'date' => now()->addDays(rand(1, 60)),

                'heure_debut' => sprintf('%02d:00', $heureDebut),

                'heure_fin' => sprintf('%02d:00', $heureFin),

                'lieu' => 'Nancy',

                'pour_enfant' => rand(0, 1),

                'nombre_participants' => rand(10, 200),

                'tarif' => rand(0, 50),
            ]);

            /*
            |--------------------------------------------------------------------------
            | Associer des catégories aléatoires
            |--------------------------------------------------------------------------
            */

            $randomCategories = Category::inRandomOrder()
                ->limit(rand(1, 3))
                ->pluck('id');

            $event->categories()->attach($randomCategories);
        }
    }
}
