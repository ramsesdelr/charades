<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AddScore implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $score;

    public function __construct($score)
    {
        $this->score = $score;
    }

    public function broadcastOn()
    {
        return ['scoring-channel'];
    }

    public function broadcastAs()
    {
        return 'add-score';
    }
}
