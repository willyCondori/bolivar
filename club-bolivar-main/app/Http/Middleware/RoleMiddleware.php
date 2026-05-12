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

        if (!$user) {
            abort(403, 'Sin acceso.');
        }

        $roleName = $user->role?->nombre;

        if (!$roleName) {
            abort(403, 'Sin acceso.');
        }

        if (!in_array($roleName, $roles, true)) {

            if ($roleName === 'socio') {
                return redirect()->route('socio.panel');
            }

            abort(403, 'No tienes permiso para acceder a esta sección.');
        }

        return $next($request);
    }
}