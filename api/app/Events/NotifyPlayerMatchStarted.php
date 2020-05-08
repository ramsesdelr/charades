<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotifyPlayerMatchStarted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $player_id;

    public function __construct($player_id)
    {
        $this->player_id = $player_id;
    }

    public function broadcastOn()
    {
        return ['scoring-channel'];
    }

    public function broadcastAs()
    {
        return 'match-started';
    }
}
