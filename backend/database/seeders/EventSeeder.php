<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return; // Exit if no users exist
        }

        // Define multiple static events
        $events = [
            [
                'title' => 'Conference 2025',
                'description' => 'An annual tech conference for developers.',
                'date' => now()->addDays(10),
                'location' => 'San Francisco',
            ],
            [
                'title' => 'Music Festival',
                'description' => 'A weekend-long festival featuring top artists.',
                'date' => now()->addDays(20),
                'location' => 'Los Angeles',
            ],
            [
                'title' => 'Startup Pitch Night',
                'description' => 'Entrepreneurs pitch their ideas to investors.',
                'date' => now()->addDays(30),
                'location' => 'New York',
            ],
            [
                'title' => 'Art Exhibition',
                'description' => 'Showcasing modern art from local artists.',
                'date' => now()->addDays(15),
                'location' => 'Chicago',
            ],
            [
                'title' => 'Hackathon 2025',
                'description' => 'A 48-hour coding competition.',
                'date' => now()->addDays(25),
                'location' => 'Austin',
            ],
        ];

        foreach ($events as $eventData) {
            $userId = $users->random()->id;
            Event::create(array_merge($eventData, [
                'user_id' => $userId,
            ]));
        }


        $events = Event::all();

        foreach ($events as $event) {
            $user = User::find($event->user_id);

            if ($user) {
                $user->givePermission('events.' . $event->id . '.read');
                $user->givePermission('events.' . $event->id . '.update');
                $user->givePermission('events.' . $event->id . '.delete');
            }
        }
    }
}
