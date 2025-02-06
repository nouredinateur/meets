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
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        Event::factory(10)->create()->each(function ($event) use ($users) {
            $user = $users->random();

            $event->user_id = $user->id;
            $event->save();
        });
    }
}
