<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // ✅ Verificar estado del socio
        if ($user->role && $user->role->nombre === 'socio') {

            $socio = \App\Models\Socio::where('user_id', $user->id)->first();

            if ($socio && in_array($socio->estado, ['Inactivo', 'Bloqueado'])) {

                Auth::guard('web')->logout();

                // ❌ NO invalidar sesión antes del error
                throw ValidationException::withMessages([
                    'email' => $socio->estado === 'Inactivo'
                        ? 'Tu cuenta está inactiva. Contacta con el administrador.'
                        : 'Tu cuenta está bloqueada. Contacta con el administrador.',
                ]);
            }
        }

        $request->session()->regenerate();

        // ✅ Redirección según rol
        if ($user->role && $user->role->nombre === 'socio') {
            return redirect()->route('socio.panel');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}