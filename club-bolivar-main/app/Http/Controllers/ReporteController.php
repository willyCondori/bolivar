<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Acceso;
use App\Models\IntentoAccesoFallido;

class ReporteController extends Controller
{
    public function ingresos(Request $request)
    {
        try {
            $fecha = $request->fecha;
            $tipo = $request->tipo;

            // 🔹 ACCESOS VALIDOS
            $accesos = Acceso::with('socio')
                ->when($fecha, function ($query) use ($fecha) {
                    $query->whereRaw("DATE(created_at) = ?", [$fecha]);
                })
                ->when($tipo && $tipo !== 'todos', function ($query) use ($tipo) {
                    $query->where('tipo', $tipo);
                })
                ->get();

            // 🔹 ACCESOS FALLIDOS
            $fallidos = IntentoAccesoFallido::with('socio')
                ->when($fecha, function ($query) use ($fecha) {
                    $query->whereDate('created_at', $fecha);
                })
                ->get();

            return response()->json([
                'accesos' => $accesos,
                'fallidos' => $fallidos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en el servidor',
                'message' => $e->getMessage(),
                'line' => $e->getLine()

            ], 500);
        }
    }
}