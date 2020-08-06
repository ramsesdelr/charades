<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ResetUserPassword extends Mailable
{
    use Queueable, SerializesModels;
    public $user_data;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_data)
    {
        $this->user_data = $user_data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.users.reset-password')->with([
            'user_data' => $this->user_data,
        ]);;
    }
}
