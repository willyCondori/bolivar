<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $notifications = $user->notifications()
            ->select('id', 'type', 'data', 'created_at')
            ->latest()
            ->get();

        $formatted = $notifications->map(function ($n) {
            return [
                'id'         => $n->id,
                'type'       => $n->type,
                'data'       => is_array($n->data)
                    ? $n->data
                    : json_decode($n->data, true),
                'created_at' => $n->created_at,
            ];
        });

        return Inertia::render('Accesos/Notificaciones/Notificacion', [
            'notifications' => $formatted
        ]);
    }
}