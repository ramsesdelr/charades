<?php

namespace App\Mail;
use App\Matches;
use App\UsersMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InviteUserToMatch extends Mailable
{
    use Queueable, SerializesModels;
    public $match;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($match) {
        $this->match = $match;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {

        return $this->view('emails.matches.invite')
                    ->text('emails.matches.invite-plain')
                    ->with([
                        'match' => $this->match,
                    ]);
    }
}
