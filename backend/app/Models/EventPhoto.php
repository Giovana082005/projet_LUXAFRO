<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class EventPhoto extends Model
{
    protected $fillable = [
        'event_id',
        'image_path',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    protected static function booted()
    {
        static::deleting(function ($photo) {

            if ($photo->image_path &&
                Storage::disk('public')->exists($photo->image_path)) {

                Storage::disk('public')->delete($photo->image_path);
            }
        });
    }

    
}