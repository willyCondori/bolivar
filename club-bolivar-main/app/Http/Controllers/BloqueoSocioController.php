<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BloqueoSocioController extends Controller
{
    public function show(Socio $socio)
    {
        return Inertia::render('Accesos/Socios/BloqueoSocio', [
            'socio' => $socio->load(['membresias', 'user']),
        ]);
    }

    public function execute(Request $request, Socio $socio)
    {
        $request->validate([
            'motivo' => 'nullable|string|max:500',
        ]);

        // 1. Bloquear socio
        $socio->update([
            'estado'        => 'Bloqueado',
            'observaciones' => $request->motivo,
        ]);

        // 2. Desactivar usuario relacionado
        if ($socio->user) {
            $socio->user->update([
                'activo'  => false,
                'deleted' => true,
            ]);
        }

        // 3. Desactivar membresías activas
        $socio->membresias()
            ->where('estado', 'activo')
            ->update([
                'deleted' => true,
                'estado' => 'inactivo'
            ]);

        return redirect()
            ->route('socios.index')
            ->with('success', 'Socio bloqueado correctamente.');
    }

    public function desbloquear(Socio $socio)
    {
        // 1. Reactivar socio
        $socio->update([
            'estado'        => 'Activo',
            'observaciones' => null,
        ]);

        // 2. Reactivar usuario relacionado
        if ($socio->user) {
            $socio->user->update([
                'activo'  => true,
                'deleted' => false,
            ]);
        }

        // 3. Reactivar membresías eliminadas
        $socio->membresias()
            ->update([
                'deleted' => false,
            ]);

        return redirect()
            ->route('socios.index')
            ->with('success', 'Socio desbloqueado correctamente.');
    }
}