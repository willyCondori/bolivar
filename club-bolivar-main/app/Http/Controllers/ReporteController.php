<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Acceso;

class ReporteController extends Controller
{
    public function ingresos(Request $request)
    {
        try {
            $fecha = $request->fecha;
            $tipo  = $request->tipo;

            $query = Acceso::query()
                ->select('id', 'socio_id', 'tipo', 'metodo_verificacion', 'created_at')
                ->with([
                    'socio:id,nombres,apellidos'
                ]);

            if ($fecha) {
                $query->whereDate('created_at', $fecha);
            }

            if ($tipo && $tipo !== 'todos' && $tipo !== 'fallido') {
                $query->where('tipo', $tipo);
            }

            $accesos = $query
                ->latest('created_at')
                ->get();

            return response()->json([
                'accesos'  => $accesos,
                'fallidos' => [],
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => true,
                'mensaje' => 'Error al generar reporte',
            ], 500);
        }
    }
}