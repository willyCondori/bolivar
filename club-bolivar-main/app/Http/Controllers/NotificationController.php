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
            ->latest()
            ->get()
            ->map(function ($n) {
                return [
                    'id'         => $n->id,
                    'type'       => $n->type,
                    'data'       => is_string($n->data) ? json_decode($n->data, true) : $n->data,
                    'created_at' => $n->created_at,
                ];
            });

        return Inertia::render('Accesos/Notificaciones/Notificacion', [
            'notifications' => $notifications
        ]);
    }
}