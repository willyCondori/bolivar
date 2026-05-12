<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BloqueoSocioController extends Controller
{
    public function show(Socio $socio)
    {
        $socio->load([
            'membresias:id,socio_id,estado,deleted,fecha_inicio,fecha_fin',
            'user:id,activo,deleted'
        ]);

        return Inertia::render('Accesos/Socios/BloqueoSocio', [
            'socio' => $socio,
        ]);
    }

    public function execute(Request $request, Socio $socio)
    {
        $request->validate([
            'motivo' => 'nullable|string|max:500',
        ]);

        $socio->update([
            'estado'        => 'bloqueado',
            'observaciones' => $request->motivo,
        ]);

        if ($socio->user) {
            $socio->user()->update([
                'activo'  => false,
                'deleted' => true,
            ]);
        }

        $socio->membresias()
            ->where('estado', 'activo')
            ->update([
                'deleted' => true,
                'estado'  => 'inactivo',
            ]);

        return redirect()
            ->route('socios.index')
            ->with('success', 'Socio bloqueado correctamente.');
    }

    public function desbloquear(Socio $socio)
    {
        $socio->update([
            'estado'        => 'activo',
            'observaciones' => null,
        ]);

        if ($socio->user) {
            $socio->user()->update([
                'activo'  => true,
                'deleted' => false,
            ]);
        }

        $socio->membresias()
            ->where('deleted', true)
            ->update([
                'deleted' => false,
                'estado'  => 'activo',
            ]);

        return redirect()
            ->route('socios.index')
            ->with('success', 'Socio desbloqueado correctamente.');
    }
}