<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Acceso;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function ingresos(Request $request)
    {
        try {
            $fecha = $request->fecha;
            $tipo  = $request->tipo;

            $query = Acceso::with('socio')
                ->select('id', 'socio_id', 'tipo', 'metodo_verificacion', 'created_at');

            if ($fecha) {
                $query->whereDate('created_at', $fecha);
            }

            if ($tipo && $tipo !== 'todos' && $tipo !== 'fallido') {
                $query->where('tipo', $tipo);
            }

            $accesos = $query->orderByDesc('created_at')->get();

            return response()->json([
                'accesos'  => $accesos,
                'fallidos' => [],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error'   => true,
                'mensaje' => $e->getMessage(),
            ], 500);
        }
    }
}