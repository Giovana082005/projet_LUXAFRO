<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    // Champs autorisés
    protected $fillable = [
        'nom',
        'description',
        'date',
        'heure_debut',
        'heure_fin',
        'lieu',
        'pour_enfant',
        'nombre_participants',
        'tarif',
    ];

    // Cast automatique des types
    protected $casts = [
        'pour_enfant' => 'boolean',
        'date' => 'date',
        'heure_debut' => 'string',
        'heure_fin' => 'string',
        'tarif' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    // Relation many-to-many avec Category
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    // Relation one-to-many avec les photos
    public function photos()
    {
        return $this->hasMany(EventPhoto::class);
    }
}