<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PlayerTurn implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $current_player;

    public function __construct($current_player)
    {
        $this->current_player  = $current_player;
    }

    public function broadcastOn()
    {
        return ['scoring-channel'];
    }

    public function broadcastAs()
    {
        return 'current-player';
    }
}
