<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Socio;
use App\Models\Acceso;
use Illuminate\Support\Facades\Auth;
use App\Services\AccesoSocioService;
use App\Models\IntentoAccesoFallido;

class AccesoQRController extends Controller
{
    public function __construct(private AccesoSocioService $accesoService) {}

    public function validarQR(Request $request)
    {
        try {

            $request->validate([
                'codigo' => 'required',
                'tipo'   => 'required|in:entrada,salida',
            ]);

            $socio = Socio::select('id', 'nombres', 'apellidos', 'qr_token', 'estado', 'activo', 'deleted')
                ->where('qr_token', $request->codigo)
                ->first();

            if (!$socio) {
                return response()->json([
                    'estado'  => 'fallo',
                    'mensaje' => 'QR inválido',
                ], 404);
            }

            // 1. Estado del socio
            if ($error = $this->accesoService->validarSocio($socio)) {
                IntentoAccesoFallido::create([
                    'socio_id'       => $socio->id,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => $error['motivo'],
                ]);
                return response()->json($error, 403);
            }

            // 2. Secuencia entrada/salida
            // En AccesoQRController y ReconocimientoController
            if ($error = $this->accesoService->verificarSecuenciaAcceso($socio, $request->tipo)) {                IntentoAccesoFallido::create([
                    'socio_id'       => $socio->id,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => $error['motivo'],
                ]);
                return response()->json($error, 422);
            }

            // 4. Registro
            $acceso = Acceso::create([
                'socio_id'            => $socio->id,
                'user_id'             => Auth::id() ?? null,
                'tipo'                => $request->tipo,
                'metodo_verificacion' => 'qr',
                'resultado_pdi'       => 'aprobado',
                'ip_dispositivo'      => $request->ip(),
                'dispositivo_info'    => $request->userAgent(),
            ]);

            // 5. Notificación
            $this->accesoService->notificarAdmins($acceso);

            return response()->json([
                'estado'    => 'exito',
                'nombres'   => $socio->nombres,
                'apellidos' => $socio->apellidos,
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'estado'  => 'error',
                'mensaje' => 'Error interno',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}