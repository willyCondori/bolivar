<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Socio;
use App\Models\Acceso;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Services\AccesoSocioService;
use App\Models\IntentoAccesoFallido;
use App\Notifications\AccesoRegistradoNotification;
use App\Models\User;

class AccesoQRController extends Controller
{
    public function validarQR(Request $request)
    {
        try {

            $request->validate([
                'codigo' => 'required',
                'tipo'   => 'required|in:entrada,salida'
            ]);

            // 🔥 OPTIMIZACIÓN: solo campos necesarios
            $socio = Socio::select('id', 'nombres', 'apellidos', 'qr_token', 'estado', 'activo', 'deleted')
                ->where('qr_token', $request->codigo)
                ->first();

            if (!$socio) {
                return response()->json([
                    'estado'  => 'fallo',
                    'mensaje' => 'QR inválido'
                ], 404);
            }

            $validator = new AccesoSocioService();
            $estado = $validator->validarSocio($socio);

            if ($estado) {

                IntentoAccesoFallido::create([
                    'socio_id'       => $socio->id,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => $estado['motivo'],
                ]);

                return response()->json($estado, 403);
            }

            $bloqueo = $this->verificarBloqueoEntrada($socio->id, $request->tipo);

            if ($bloqueo) {
                return response()->json($bloqueo, 429);
            }

            $acceso = Acceso::create([
                'socio_id'            => $socio->id,
                'user_id'             => Auth::id() ?? null,
                'tipo'                => $request->tipo,
                'metodo_verificacion' => 'qr',
                'resultado_pdi'       => 'aprobado',
                'ip_dispositivo'      => $request->ip(),
                'dispositivo_info'    => $request->userAgent(),
            ]);

            $admins = User::whereHas('role', function ($q) {
                    $q->where('nombre', 'admin');
                })
                ->select('id')
                ->get();

            foreach ($admins as $admin) {
                $admin->notify(new AccesoRegistradoNotification($acceso));
            }

            return response()->json([
                'estado'    => 'exito',
                'nombres'   => $socio->nombres,
                'apellidos' => $socio->apellidos
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'estado'  => 'error',
                'mensaje' => 'Error interno',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    private function verificarBloqueoEntrada($socioId, $tipo)
    {
        if ($tipo !== 'entrada') return null;

        $limiteTiempo = now()->subMinutes(3);

        // 🔥 OPTIMIZACIÓN: solo columnas necesarias
        $ultimoAcceso = Acceso::select('id', 'created_at')
            ->where([
                ['socio_id', '=', $socioId],
                ['tipo', '=', 'entrada'],
            ])
            ->where('created_at', '>=', $limiteTiempo)
            ->latest()
            ->first();

        if ($ultimoAcceso) {
            return [
                'estado'        => 'bloqueado',
                'mensaje'       => 'Ya existe una entrada reciente (menos de 3 minutos).',
                'ultimo_acceso' => $ultimoAcceso->created_at
            ];
        }

        return null;
    }
}