<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Socio;
use App\Models\Acceso;
use Illuminate\Support\Facades\Auth;

class AccesoQRController extends Controller
{
    public function validarQR(Request $request)
    {
        try {

            $request->validate([
                'codigo' => 'required',
                'tipo' => 'required|in:entrada,salida'
            ]);

            $socio = Socio::where('qr_token', $request->codigo)->first();

            if (!$socio) {
                return response()->json([
                    'estado' => 'fallo',
                    'mensaje' => 'QR inválido'
                ], 404);
            }

            Acceso::create([
                'socio_id' => $socio->id,
                'user_id' => Auth::id() ?? null,
                'tipo' => $request->tipo,
                'metodo_verificacion' => 'qr',
                'resultado_pdi' => 'aprobado',
                'ip_dispositivo' => $request->ip(),
                'dispositivo_info' => $request->userAgent(),
            ]);

            return response()->json([
                'estado' => 'exito',
                'nombres' => $socio->nombres,
                'apellidos' => $socio->apellidos
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'estado' => 'error',
                'mensaje' => 'Error interno',
                'debug' => $e->getMessage()
            ], 500);
        }
    }
}