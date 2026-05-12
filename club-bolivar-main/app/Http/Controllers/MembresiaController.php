<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MembresiaController extends Controller
{
    /* ── HELPERS OPTIMIZADO ───────────────────────────────────────── */

    private function caducarVencidas(): void
    {
        DB::table('membresias')
            ->where([
                ['estado', '=', 'activo'],
                ['deleted', '=', false],
            ])
            ->whereDate('fecha_fin', '<', now()->toDateString())
            ->update(['estado' => 'caducado']);
    }

    /* ── INDEX OPTIMIZADO ─────────────────────────────────────────── */

    public function index()
    {
        $this->caducarVencidas();

        $membresias = DB::table('membresias as m')
            ->join('socios as s', 'm.socio_id', '=', 's.id')
            ->where([
                ['m.deleted', '=', false],
                ['s.deleted', '=', false],
            ])
            ->select(
                'm.id',
                'm.tipo',
                'm.estado',
                'm.fecha_inicio',
                'm.fecha_fin',
                's.id as socio_id',
                DB::raw("CONCAT(s.nombres, ' ', s.apellidos) as nombre")
            )
            ->orderBy('m.tipo')
            ->get();

        $agrupadas = [];

        foreach ($membresias as $item) {
            $tipo = $item->tipo;

            if (!isset($agrupadas[$tipo])) {
                $agrupadas[$tipo] = [
                    'tipo'   => $tipo,
                    'total'  => 0,
                    'socios' => [],
                ];
            }

            $agrupadas[$tipo]['total']++;

            $agrupadas[$tipo]['socios'][] = [
                'id'           => $item->socio_id,
                'nombre'       => $item->nombre,
                'estado'       => $item->estado,
                'fecha_inicio' => $item->fecha_inicio,
                'fecha_fin'    => $item->fecha_fin,
            ];
        }

        return Inertia::render('Accesos/Membresias/Membresias', [
            'membresias' => array_values($agrupadas),
        ]);
    }

    public function show($id)
    {
        $this->caducarVencidas();

        return response()->json(
            DB::table('membresias as m')
                ->join('socios as s', 'm.socio_id', '=', 's.id')
                ->where('m.id', $id)
                ->select(
                    'm.*',
                    's.nombres',
                    's.apellidos'
                )
                ->first()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'socio_id'     => 'required|uuid',
            'tipo'         => 'required|in:Celeste,Dorado,Platino',
            'fecha_inicio' => 'required|date',
            'fecha_fin'    => 'required|date|after:fecha_inicio',
        ]);

        DB::table('membresias')->insert([
            'id'           => (string) Str::uuid(),
            'socio_id'     => $request->socio_id,
            'tipo'         => $request->tipo,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin'    => $request->fecha_fin,
            'estado'       => 'activo',
            'deleted'      => false,
        ]);

        return redirect()->route('accesos.membresias')
            ->with('success', 'Membresía creada correctamente');
    }

    public function updateEstado($id)
    {
        $membresia = DB::table('membresias')
            ->select('id', 'estado')
            ->where('id', $id)
            ->first();

        if (!$membresia) {
            return back()->with('error', 'Membresía no encontrada');
        }

        if ($membresia->estado === 'caducado') {
            return back()->with('error', 'No se puede reactivar una caducada');
        }

        $estadoMap = [
            'activo'   => 'inactivo',
            'inactivo' => 'activo',
        ];

        $nuevoEstado = $estadoMap[$membresia->estado] ?? 'activo';

        DB::table('membresias')
            ->where('id', $id)
            ->update(['estado' => $nuevoEstado]);

        return back()->with('success', 'Estado actualizado');
    }

    public function destroy($id)
    {
        DB::table('membresias')
            ->where('id', $id)
            ->update(['deleted' => true]);

        return back()->with('success', 'Membresía eliminada');
    }
}