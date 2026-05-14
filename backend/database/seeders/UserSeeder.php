<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        
        /*
        |--------------------------------------------------------------------------
        | UTILISATEURS
        |--------------------------------------------------------------------------
        */

        for ($i = 1; $i <= 50; $i++) {

            User::create([

                'name' => 'Utilisateur ' . $i,

                'email' => 'user' . $i . '@test.com',

                'password' => Hash::make('password'),

                'role' => User::ROLE_USER,
            ]);
        }
    }
}