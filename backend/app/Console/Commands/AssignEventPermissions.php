<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use App\Models\User;

class AssignEventPermissions extends Command
{
    protected $signature = 'permissions:assign-events';
    protected $description = 'Assign permissions for existing events to their owners';

    public function handle()
    {
        $events = Event::all();

        foreach ($events as $event) {
            $user = User::find($event->user_id);

            if ($user) {
                $user->givePermission('events.' . $event->id . '.read');
                $user->givePermission('events.' . $event->id . '.update');
                $user->givePermission('events.' . $event->id . '.delete');

                $this->info("Assigned permissions for event {$event->id} to user {$user->id}");
            } else {
                $this->error("User not found for event {$event->id}");
            }
        }

        $this->info('Permissions assigned for all events.');
    }
}
