<?php

namespace App\Models;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Event extends BaseModel
{
    protected $visible =
    [
        'title',
        'date',
        'location',
        'max_participants',
    ];

    protected $fillable = [
        'title',
        'date',
        'location',
        'max_participants',
        'user_id',
    ];

    protected static function booted()
    {
        parent::booted();
        static::created(function ($event) {
            $user = User::find($event->user_id);
            if ($user) {
                $user->givePermission('events.' . $event->id . '.read');
                $user->givePermission('events.' . $event->id . '.update');
                $user->givePermission('events.' . $event->id . '.delete');
            }

            $authUser = auth()->user();
            if ($authUser) {
                $event->participants()->attach($authUser->id);
            }
        });

        static::deleted(function ($event) {
            $permissions = Permission::where('name', 'like', 'events.' . $event->id . '.%')->get();
            DB::table('users_permissions')->whereIn('permission_id', $permissions->pluck('id'))->delete();
            Permission::destroy($permissions->pluck('id'));
        });
    }
    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_participants');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function allParticipants()
    {
        return $this->participants->push($this->creator)->unique('id');
    }
}
