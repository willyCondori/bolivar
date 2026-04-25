<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MembresiaController extends Controller
{
    /* ── HELPERS ──────────────────────────────────────────────────────────── */

    /**
     * Marca como 'caducado' todas las membresías activas cuya fecha_fin
     * ya pasó. Se llama al inicio de cualquier operación de consulta/listado.
     */
    private function caducarVencidas(): void
    {
        DB::table('membresias')
            ->where('estado', 'activo')
            ->where('deleted', false)
            ->whereDate('fecha_fin', '<', now()->toDateString())
            ->update(['estado' => 'caducado']);
    }

    /* ── CRUD ─────────────────────────────────────────────────────────────── */

    /**
     * Mostrar listado de membresías con sus socios.
     */
    public function index()
    {
        // Primero caducar las vencidas antes de mostrar
        $this->caducarVencidas();

        $membresias = DB::table('membresias as m')
            ->join('socios as s', 'm.socio_id', '=', 's.id')
            ->where('m.deleted', false)
            ->where('s.deleted', false)
            ->select(
                'm.id',
                'm.tipo',
                'm.estado',
                'm.fecha_inicio',
                'm.fecha_fin',
                'm.monto_pagado',
                's.id as socio_id',
                's.nombres',
                's.apellidos'
            )
            ->orderBy('m.tipo')
            ->get();

        // Agrupar por tipo de membresía
        $agrupadas = $membresias->groupBy('tipo')->map(function ($items, $tipo) {
            return [
                'tipo'   => $tipo,
                'total'  => $items->count(),
                'socios' => $items->map(fn($item) => [
                    'id'           => $item->socio_id,
                    'nombre'       => $item->nombres . ' ' . $item->apellidos,
                    'estado'       => $item->estado,
                    'fecha_inicio' => $item->fecha_inicio,
                    'fecha_fin'    => $item->fecha_fin,
                ])->values(),
            ];
        })->values();

        return Inertia::render('Accesos/Membresias/Membresias', [
            'membresias' => $agrupadas,
        ]);
    }

    /**
     * Mostrar detalle de una membresía.
     */
    public function show($id)
    {
        $this->caducarVencidas();

        $membresia = DB::table('membresias as m')
            ->join('socios as s', 'm.socio_id', '=', 's.id')
            ->where('m.id', $id)
            ->select('m.*', 's.nombres', 's.apellidos')
            ->first();

        return response()->json($membresia);
    }

    /**
     * Crear membresía.
     */
    public function store(Request $request)
    {
        $request->validate([
            'socio_id'     => 'required|uuid',
            'tipo'         => 'required|in:Celeste,Dorado,Platino',
            'fecha_inicio' => 'required|date',
            'fecha_fin'    => 'required|date|after:fecha_inicio',
            'monto_pagado' => 'nullable|numeric',
        ]);

        DB::table('membresias')->insert([
            'id'           => (string) Str::uuid(),
            'socio_id'     => $request->socio_id,
            'tipo'         => $request->tipo,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin'    => $request->fecha_fin,
            'monto_pagado' => $request->monto_pagado,
            'estado'       => 'activo',
            'deleted'      => false,
        ]);

        return redirect()->route('accesos.membresias')
            ->with('success', 'Membresía creada correctamente');
    }

    /**
     * Cambiar estado: activo ↔ inactivo.
     * Las membresías caducadas NO se pueden reactivar desde aquí;
     * para eso hay que renovar (crear una nueva).
     */
    public function updateEstado($id)
    {
        $membresia = DB::table('membresias')->where('id', $id)->first();

        if (!$membresia) {
            return back()->with('error', 'Membresía no encontrada');
        }

        if ($membresia->estado === 'caducado') {
            return back()->with('error', 'No se puede reactivar una membresía caducada. Debe renovarla.');
        }

        $nuevoEstado = match ($membresia->estado) {
            'activo'   => 'inactivo',
            'inactivo' => 'activo',
            default    => 'activo',
        };

        DB::table('membresias')
            ->where('id', $id)
            ->update(['estado' => $nuevoEstado]);

        return back()->with('success', 'Estado actualizado');
    }

    /**
     * Eliminado lógico.
     */
    public function destroy($id)
    {
        DB::table('membresias')
            ->where('id', $id)
            ->update(['deleted' => true]);

        return back()->with('success', 'Membresía eliminada');
    }
}