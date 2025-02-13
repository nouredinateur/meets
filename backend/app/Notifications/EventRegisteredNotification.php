<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class EventRegisteredNotification extends Notification implements ShouldQueue
{
    use Queueable;


    public $event;
    public $user;

    public function __construct(Event $event, $user)
    {
        $this->event = $event;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "{$this->user->email} has registered for your event: {$this->event->title}",
            'event_id' => $this->event->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => "{$this->user->email} has registered for your event: {$this->event->title}",
            'event_id' => $this->event->id,
        ]);
    }

    public function broadcastOn()
    {
        return ['meets'];
    }

    public function broadcastAs()
    {
        return 'EventRegistered';
    }
}
