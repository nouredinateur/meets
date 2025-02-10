<?php

namespace App\Services;

use App\Models\User;
use App\Enums\ROLE;

class UserService
{
    public function createUser(array $data, ROLE $role): User
    {
        $user = User::create($data);
        $this->assignRole($user, $role);
        $this->generateAvatar($user);
        return $user;
    }

    public function assignRole(User $user, ROLE $role): void
    {
        $user->syncRoles([$role]);
    }

    public function generateAvatar(User $user): void
    {

        if (!$user->avatar) {
            $seed = $user->id;
            $avatarUrl = "https://api.dicebear.com/9.x/micah/svg?" . http_build_query([
                'seed' => $seed,
            ]);
            $user->update(['avatar' => $avatarUrl]);
        }
    }
}
