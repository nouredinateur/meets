<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\CrudController;

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

            // Eager-load both participants and the creator
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
                            'title' => $event->title,
                            'date' => $event->date,
                            'location' => $event->location,
                            'maxParticipants' => $event->maxParticipants,
                            'participants' => $event->allParticipants()->map(function ($user) {
                                return [
                                    'id' => $user->id,
                                    'name' => $user->name,
                                    'email' => $user->email,
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
}
