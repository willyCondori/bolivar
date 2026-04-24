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
            $tipo = $request->tipo;

            $query = Acceso::query()
                ->leftJoin('socios', 'accesos.socio_id', '=', 'socios.id')
                ->select(
                    'accesos.created_at as fecha',
                    'socios.nombres',
                    'socios.apellidos',
                    'accesos.tipo',
                    DB::raw("'correcto' as estado")
                );

            if ($fecha) {
                $query->whereDate('accesos.created_at', $fecha);
            }

            if ($tipo && $tipo !== 'todos') {
                $query->where('accesos.tipo', $tipo);
            }

            $accesos = $query->get();

            return response()->json([
                'accesos' => $accesos,
                'fallidos' => [] // luego puedes integrar
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'error' => true,
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }
}