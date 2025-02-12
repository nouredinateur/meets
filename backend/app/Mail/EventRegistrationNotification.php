<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class EventRegistrationNotification extends Mailable implements ShouldQueue
{
    public $event;
    public $user;

    public function __construct($event, $user)
    {
        $this->event = $event;
        $this->user = $user;
    }

    public function build()
    {
        Log::info("Preparing email for event registration", [
            'eventTitle' => $this->event->title,
            'userEmail' => $this->user->email,
            'eventDate' => $this->event->date,
        ]);

        return $this->subject("New Registration for {$this->event->title}")
            ->view('vendor/mail/html/event-registration')->with([
                'eventTitle' => $this->event->title,
                'userEmail' => $this->user->email,
                'eventDate' => $this->event->date,
            ]);
    }
}
