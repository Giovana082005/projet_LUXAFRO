<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /**
     * STATUTS DE RÉSERVATION
     */
    const STATUS_PENDING   = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_PAID      = 'paid';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Champs autorisés en mass assignment
     */
    protected $fillable = [
        'user_id',
        'event_id',
        'nb_adultes',
        'nb_enfants',
        'total_price',
        'status',
        'payment_method'
    ];

    /**
     * Casts (utile pour éviter erreurs)
     */
    protected $casts = [
        'nb_adultes' => 'integer',
        'nb_enfants' => 'integer',
        'total_price' => 'float',
    ];

    /**
     * Relation : utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : événement
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Vérifie si la réservation est active (compte pour les places)
     */
    public function isActive(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_CONFIRMED,
            self::STATUS_PAID,
        ]);
    }

    /**
     * Accesseur : nombre total de places
     */
    public function getTotalPlacesAttribute(): int
    {
        return $this->nb_adultes + $this->nb_enfants;
    }
}