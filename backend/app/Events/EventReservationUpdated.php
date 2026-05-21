<?php

namespace App\Events;

use App\Models\Event;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EventReservationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $eventData;

    public function __construct(Event $event)
    {
        $this->eventData = [
            'id' => $event->id,
            'nom' => $event->nom,
            'reserved_places' => $event->reserved_places,
            'places_restantes' => $event->places_restantes,
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('events')
        ];
    }

    public function broadcastAs(): string
    {
        return 'event.updated';
    }
}