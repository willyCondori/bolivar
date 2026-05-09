<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $user = Auth::user();

        if (!$user || !$user->role) {
            abort(403, 'Sin acceso.');
        }

        if (!in_array($user->role->nombre, $roles)) {
            // Si es socio, redirige a su panel
            if ($user->role->nombre === 'socio') {
                return redirect()->route('socio.panel');
            }
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }

        return $next($request);
    }
}