<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\Acceso;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\IntentoAccesoFallido;

class ReconocimientoController extends Controller
{
    public function verificar(Request $request)
    {
        // 1. Validar datos
        $request->validate([
            'imagen' => 'required|image|max:5120',
            'tipo' => 'required|in:entrada,salida',
        ]);

        try {
            $imagenCamara = $request->file('imagen');

            // 2. Obtener socios con foto
            $socios = Socio::whereNotNull('foto_path')->get();

            if ($socios->isEmpty()) {
                return response()->json([
                    'estado' => 'error',
                    'mensaje' => 'No hay socios registrados para comparar.'
                ], 400);
            }

            // 3. FastAPI request
            $urlFastAPI = 'http://127.0.0.1:8001/reconocer';

            $requestFastAPI = Http::asMultipart()
                ->attach(
                    'file_camera',
                    file_get_contents($imagenCamara),
                    'camera.jpg'
                );

            foreach ($socios as $socio) {
                if (Storage::disk('public')->exists($socio->foto_path)) {
                    $requestFastAPI->attach(
                        'file_db',
                        Storage::disk('public')->get($socio->foto_path),
                        $socio->id . '.jpg'
                    );
                }
            }

            // 4. Ejecutar IA
            $response = $requestFastAPI->post($urlFastAPI);

            if ($response->failed()) {
                throw new \Exception("Servicio de IA no disponible.");
            }

            $resultado = $response->json();

            // 5. Verificar match
            if ($resultado['match'] && !empty($resultado['id'])) {

                $socioEncontrado = Socio::find($resultado['id']);

                if (!$socioEncontrado) {
                    return response()->json([
                        'estado' => 'fallo',
                        'mensaje' => 'Socio no encontrado en base de datos'
                    ]);
                }

                // 6. CONTROL DE 3 MINUTOS (IMPORTANTE)
                $limiteTiempo = Carbon::now()->subMinutes(3);

                $ultimoAcceso = Acceso::where('socio_id', $socioEncontrado->id)
                    ->where('created_at', '>=', $limiteTiempo)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if ($ultimoAcceso) {
                    IntentoAccesoFallido::create([
                        'socio_id' => $socioEncontrado->id,
                        'ip_dispositivo' => $request->ip(),
                        'similitud_facial' => $resultado['distance'] ?? null,
                        'motivo_rechazo' => 'Bloqueo temporal (3 minutos)',
                    ]);
                    return response()->json([
                        'estado' => 'bloqueado',
                        'mensaje' => 'Ya existe un acceso reciente (menos de 3 minutos).',
                        'ultimo_acceso' => $ultimoAcceso->created_at
                    ]);
                }

                // 7. CREAR ACCESO
                Acceso::create([
                    'socio_id' => $socioEncontrado->id,
                    'tipo' => $request->input('tipo'), // entrada o salida
                    'metodo_verificacion' => 'facial',
                    'resultado_pdi' => 'aprobado',
                    'similitud_facial' => 1 - $resultado['distance'],
                    'ip_dispositivo' => $request->ip(),
                    'dispositivo_info' => $request->header('User-Agent'),
                    'created_at' => now(),
                ]);

                return response()->json([
                    'estado' => 'exito',
                    'nombres' => $socioEncontrado->nombres,
                    'apellidos' => $socioEncontrado->apellidos,
                    'id' => $socioEncontrado->id,
                    'distancia' => $resultado['distance'],
                    'tipo' => $request->input('tipo'),
                    'mensaje' => 'Acceso concedido'
                ]);
            }

            // 8. NO MATCH
            IntentoAccesoFallido::create([
                'socio_id' => null,
                'ip_dispositivo' => $request->ip(),
                'similitud_facial' => $resultado['distance'] ?? null,
                'motivo_rechazo' => 'No identificado por IA',
            ]);

            return response()->json([
                'estado' => 'fallo',
                'mensaje' => 'Usuario no identificado'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'estado' => 'error',
                'mensaje' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}   