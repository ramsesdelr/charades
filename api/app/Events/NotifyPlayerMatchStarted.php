<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotifyPlayerMatchStarted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $match_status;

    public function __construct($match_status)
    {
        $this->match_status = $match_status;
    }

    public function broadcastOn()
    {
        return ['scoring-channel'];
    }

    public function broadcastAs()
    {
        return 'match-status';
    }
}
