<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\Acceso;
use Carbon\Carbon;
use App\Models\IntentoAccesoFallido;
use App\Services\AccesoSocioService;
use App\Models\User;
use App\Notifications\AccesoRegistradoNotification;

class ReconocimientoController extends Controller
{
    public function verificar(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|max:5120',
            'tipo'   => 'required|in:entrada,salida',
        ]);

        try {
            $imagenCamara = $request->file('imagen');

            $socios = Socio::whereNotNull('foto_path')
                ->select('id', 'foto_path')
                ->get();

            if ($socios->isEmpty()) {
                return response()->json([
                    'estado'  => 'error',
                    'mensaje' => 'No hay socios registrados.'
                ], 400);
            }

            $urlFastAPI = 'http://127.0.0.1:8001/reconocer';

            $requestFastAPI = Http::asMultipart()
                ->attach(
                    'file_camera',
                    file_get_contents($imagenCamara->getRealPath()),
                    'camera.jpg'
                );

            foreach ($socios as $socio) {

                $path = $socio->foto_path;

                if ($path && Storage::disk('public')->exists($path)) {

                    $requestFastAPI->attach(
                        'file_db',
                        Storage::disk('public')->get($path),
                        $socio->id . '.jpg'
                    );
                }
            }

            $response = $requestFastAPI->timeout(30)->post($urlFastAPI);

            if ($response->failed()) {
                throw new \Exception("Servicio de IA no disponible.");
            }

            $resultado = $response->json();

            if (!empty($resultado['match']) && !empty($resultado['id'])) {

                $socioEncontrado = Socio::select('id', 'nombres', 'apellidos')
                    ->find($resultado['id']);

                if (!$socioEncontrado) {
                    return response()->json([
                        'estado'  => 'fallo',
                        'mensaje' => 'Socio no encontrado'
                    ]);
                }

                $validator = new AccesoSocioService();
                $estado = $validator->validarSocio($socioEncontrado);

                if ($estado) {

                    IntentoAccesoFallido::create([
                        'socio_id'        => $socioEncontrado->id,
                        'ip_dispositivo'  => $request->ip(),
                        'similitud_facial'=> $resultado['distance'] ?? null,
                        'motivo_rechazo'  => $estado['motivo'],
                    ]);

                    return response()->json($estado, 403);
                }

                $bloqueo = $this->verificarBloqueoEntrada(
                    $socioEncontrado->id,
                    $request->tipo
                );

                if ($bloqueo) {

                    IntentoAccesoFallido::create([
                        'socio_id'        => $socioEncontrado->id,
                        'ip_dispositivo'  => $request->ip(),
                        'similitud_facial'=> $resultado['distance'] ?? null,
                        'motivo_rechazo'  => 'Bloqueo temporal (3 minutos)',
                    ]);

                    return response()->json($bloqueo, 429);
                }

                $acceso = Acceso::create([
                    'socio_id'            => $socioEncontrado->id,
                    'tipo'                => $request->tipo,
                    'metodo_verificacion' => 'facial',
                    'resultado_pdi'       => 'aprobado',
                    'similitud_facial'    => 1 - ($resultado['distance'] ?? 0),
                    'ip_dispositivo'      => $request->ip(),
                    'dispositivo_info'    => $request->userAgent(),
                ]);

                // 🔥 OPTIMIZACIÓN: consulta más ligera
                $admins = User::whereHas('role', function ($q) {
                        $q->where('nombre', 'admin');
                    })
                    ->select('id')
                    ->get();

                foreach ($admins as $admin) {
                    $admin->notify(new AccesoRegistradoNotification($acceso));
                }

                return response()->json([
                    'estado'   => 'exito',
                    'nombres'  => $socioEncontrado->nombres,
                    'apellidos'=> $socioEncontrado->apellidos,
                    'id'       => $socioEncontrado->id,
                    'tipo'     => $request->tipo,
                    'mensaje'  => 'Acceso concedido'
                ]);
            }

            IntentoAccesoFallido::create([
                'socio_id'        => null,
                'ip_dispositivo'  => $request->ip(),
                'similitud_facial'=> $resultado['distance'] ?? null,
                'motivo_rechazo'  => 'No identificado por IA',
            ]);

            return response()->json([
                'estado'  => 'fallo',
                'mensaje' => 'Usuario no identificado'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'estado'  => 'error',
                'mensaje' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function verificarBloqueoEntrada($socioId, $tipo)
    {
        if ($tipo !== 'entrada') return null;

        $limiteTiempo = now()->subMinutes(3);

        $ultimoAcceso = Acceso::where('socio_id', $socioId)
            ->where('tipo', 'entrada')
            ->where('created_at', '>=', $limiteTiempo)
            ->latest()
            ->first(['id', 'created_at']);

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