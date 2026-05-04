<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    // Champs autorisés en création
    protected $fillable = [
        'nom',
        'description',
        'date',
        'horaire',
        'lieu',
        'categories',
        'pour_enfant',
        'nombre_participants',
        'tarif',
    ];

    // Cast automatique des types
    protected $casts = [
        'categories' => 'array',
        'pour_enfant' => 'boolean',
        'date' => 'date',
        'horaire' => 'datetime:H:i',
        'tarif' => 'decimal:2',
    ];

    // (Optionnel mais recommandé) liste des catégories autorisées
    public const CATEGORIES = [
        'musique',
        'sport',
        'culture',
        'danse',
        'festival',
    ];
}
