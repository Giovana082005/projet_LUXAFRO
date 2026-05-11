<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [

        'nom',

        'email',

        'raison',

        'message',

        'is_read'
    ];

    protected $casts = [

        'is_read' => 'boolean',
    ];
}