<?php

namespace App\Listeners;

use App\Events\Score;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Scorings;

class AddUserScore
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Score  $event
     * @return void
     */
    public function handle(Score $event)
    {
        // Here I can access the current user's score with $event-score
       return 'Hi';
    }
}
