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
        'heure_debut' => 'string',
        'heure_fin' => 'string',
        'tarif' => 'decimal:2',
    ];

    //  liste des catégories autorisées
    public const CATEGORIES = [
        'musique',
        'sport',
        'culture',
        'danse',
        'festival',
    ];

    //relation one to many 
    public function photos()
    {
    return $this->hasMany(EventPhoto::class);
    }

    public function reservations()
    {
    return $this->hasMany(Reservation::class);
    }
}
