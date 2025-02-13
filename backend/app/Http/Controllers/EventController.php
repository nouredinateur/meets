<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\CrudController;
use App\Mail\EventRegistrationNotification;
use Illuminate\Support\Facades\Mail;
use App\Notifications\EventRegisteredNotification;

class EventController extends CrudController
{
    protected $table = 'events';

    protected $modelClass = Event::class;

    protected $restricted = ['read_one', 'read_all', 'update', 'delete'];

    protected function getTable()
    {
        return $this->table;
    }

    protected function getModelClass()
    {
        return $this->modelClass;
    }
    public function readAll(Request $request)
    {
        try {
            $params = $this->getDatatableParams($request);
            $query = $this->getReadAllQuery();

            if ($request->input('per_page', 50) === 'all') {
                $items = $query->get();
            } else {
                $items = $query->paginate($request->input('per_page', 50));
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $items->map(function ($event) {
                        return [
                            'id' => $event->id,
                            'title' => $event->title,
                            'date' => $event->date,
                            'location' => $event->location,
                            'maxParticipants' => $event->max_participants,
                            'remainingSpots' => max(0, $event->max_participants - $event->participants()->count()),
                            'participants' => $event->allParticipants()->map(function ($user) {
                                return [
                                    'id' => $user->id,
                                    'name' => $user->name,
                                    'email' => $user->email,
                                    'avatar' => $user->avatarUrl, // Include avatar URL
                                ];
                            }),
                        ];
                    }),
                    'meta' => [
                        'currentPage' => $items->currentPage(),
                        'lastPage' => $items->lastPage(),
                        'totalItems' => $items->total(),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in EventController.readAll: ' . $e->getMessage());
            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]]);
        }
    }
    public function readUserEvents(Request $request)
    {
        try {
            $params = $this->getDatatableParams($request);
            $query = $this->getReadAllQuery()->with(['participants', 'creator'])->dataTable($params);

            if ($request->input('per_page', 50) === 'all') {
                $items = $query->get();
            } else {
                $items = $query->paginate($request->input('per_page', 50));
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $items->map(function ($event) {
                        return [
                            'id' => $event->id,
                            'title' => $event->title,
                            'date' => $event->date,
                            'location' => $event->location,
                            'maxParticipants' => $event->max_participants,
                            'remainingSpots' => max(0, $event->max_participants - $event->participants()->count()),
                            'participants' => $event->allParticipants()->map(function ($user) {
                                return [
                                    'id' => $user->id,
                                    'name' => $user->name,
                                    'email' => $user->email,
                                    'avatar' => $user->avatarUrl, // Include avatar URL
                                ];
                            }),
                        ];
                    }),
                    'meta' => [
                        'currentPage' => $items->currentPage(),
                        'lastPage' => $items->lastPage(),
                        'totalItems' => $items->total(),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in EventController.readAll: ' . $e->getMessage());
            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]]);
        }
    }
    public function createOne(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'date' => 'required|date',
                'location' => 'required|string|max:255',
                'max_participants' => 'required|integer',
                'user_id' => 'required|exists:users,id'
            ]);

            return parent::createOne(new Request($validated));
        } catch (\Exception $e) {
            Log::error('Error caught in function EventController.createOne : ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]]);
        }
    }

    public function updateOne($id, Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'date' => 'sometimes|date',
                'location' => 'sometimes|string|max:255',
                'max_participants' => 'sometimes|integer',
                'user_id' => 'sometimes|exists:users,id',
            ]);

            return parent::updateOne($id, new Request($validated));
        } catch (\Exception $e) {
            Log::error('Error caught in function EventController.updateOne : ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]]);
        }
    }

    public function register(Request $request, $eventId)
    {
        try {
            $user = auth()->user();
            $event = Event::findOrFail($eventId);

            if ($event->participants()->where('user_id', $user->id)->exists()) {
                Log::warning("User already registered", ['user_id' => $user->id, 'event_id' => $event->id]);
                return response()->json(['success' => false, 'message' => 'User already registered']);
            }

            if ($event->participants()->count() >= $event->max_participants) {
                Log::warning("Event is full", ['event_id' => $event->id]);
                return response()->json(['success' => false, 'message' => 'Event is full']);
            }

            $event->participants()->attach($user->id);
            Log::info("User registered for event", ['user_id' => $user->id, 'event_id' => $event->id]);

            if ($event->creator->email !== $user->email) {
                Mail::to($event->creator->email)->queue(new EventRegistrationNotification($event, $user));
                Log::info("Email queued for event registration", [
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                    'recipient_email' => $event->creator->email,
                    'registered_user' => $user->email,
                ]);
                $event->creator->notify(new EventRegisteredNotification($event, $user));
            }

            return response()->json(['success' => true, 'message' => 'User registered successfully']);
        } catch (\Exception $e) {
            Log::error("Error in EventController.register: " . $e->getMessage(), [
                'event_id' => $eventId ?? 'unknown',
                'user_id' => auth()->id(),
            ]);
            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]]);
        }
    }
}
