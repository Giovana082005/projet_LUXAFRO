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
    'heure_debut',
    'heure_fin',
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
        'heure_debut' => 'datetime:H:i',
        'heure_fin' => 'datetime:H:i',
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
