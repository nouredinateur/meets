<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class EventRegistrationNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $event;
    public $user;

    public function __construct(Event $event, User $user)
    {
        $this->event = $event;
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('New Event Registration')
            ->view('vendor/mail/html/event-registration')
            ->with([
                'eventTitle' => $this->event->title,
                'userName' => $this->user->name,
                'eventDate' => $this->event->date,
            ]);
    }
}
