<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserActivity;

class UserActivityController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([

            'action' => 'required|string',

            'entity_type' => 'nullable|string',

            'entity_id' => 'nullable|integer',

            'metadata' => 'nullable|array',
        ]);

        $activity = UserActivity::create([

            'user_id' => auth()->id(),

            'action' => $request->action,

            'entity_type' => $request->entity_type,

            'entity_id' => $request->entity_id,

            'metadata' => $request->metadata,
        ]);

        return response()->json([
            'message' => 'Activité enregistrée',
            'activity' => $activity,
        ]);
    }
}