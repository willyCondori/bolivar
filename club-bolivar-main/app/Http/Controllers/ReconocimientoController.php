<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Acceso;
use App\Models\IntentoAccesoFallido;
use App\Services\AccesoSocioService;
use Illuminate\Support\Facades\DB;

class ReconocimientoController extends Controller
{
    public function __construct(private AccesoSocioService $accesoService) {}

    public function verificar(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|max:5120',
            'tipo'   => 'required|in:entrada,salida',
        ]);

        try {

            $imagen = $request->file('imagen');

            Log::info('📸 Inicio reconocimiento facial', [
                'ip'   => $request->ip(),
                'tipo' => $request->tipo,
            ]);

            /* ─────────────────────────────
             * 1. FASTAPI EMBEDDING
             * ───────────────────────────── */

            $response = Http::attach(
                    'file',
                    file_get_contents($imagen->getRealPath()),
                    'camera.jpg'
                )
                ->post(env('FACIAL_API_URL') . '/embedding');

            Log::info('📡 Respuesta FastAPI embedding', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if (!$response->successful()) {
                Log::error('Error FastAPI embedding', ['body' => $response->body()]);
                return response()->json(['estado' => 'error', 'mensaje' => 'No se pudo generar embedding'], 500);
            }

            $embedding = $response->json('embedding');

            if (!$embedding || !is_array($embedding)) {
                Log::error('Embedding inválido', ['response' => $response->json()]);
                return response()->json(['estado' => 'error', 'mensaje' => 'Embedding inválido'], 500);
            }

            /* ─────────────────────────────
             * 2. BÚSQUEDA POR SIMILITUD
             * ───────────────────────────── */

            $vector    = '[' . implode(',', $embedding) . ']';

            $resultado = DB::table('socio_embeddings as se')
                ->join('socios as s', 's.id', '=', 'se.socio_id')
                ->select('s.id', 's.nombres', 's.apellidos', 's.ci', 's.foto_path', 's.activo', 's.estado', 's.deleted')
                ->selectRaw('se.embedding <=> ? as distance', [$vector])
                ->whereNotNull('se.embedding')
                ->orderBy('distance')
                ->first();

            $socio = $resultado ? Socio::find($resultado->id) : null;

            if ($socio) {
                $socio->distance = $resultado->distance;
            }

            /* ─────────────────────────────
             * 3. VALIDACIÓN ESTADO SOCIO
             * ───────────────────────────── */

            if ($error = $this->accesoService->validarSocio($socio)) {
                Log::warning('Socio rechazado por negocio', [
                    'socio_id' => $socio?->id,
                    'motivo'   => $error['motivo'],
                ]);
                IntentoAccesoFallido::create([
                    'socio_id'       => $socio->id,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => $error['motivo'],
                ]);
                return response()->json($error, 403);
            }

            /* ─────────────────────────────
             * 4. SECUENCIA ENTRADA/SALIDA
             * ───────────────────────────── */

            if ($error = $this->accesoService->verificarSecuenciaAcceso($socio, $request->tipo)) {
                Log::warning('Secuencia de acceso inválida', [
                    'socio_id' => $socio->id,
                    'motivo'   => $error['motivo'],
                ]);
                IntentoAccesoFallido::create([
                    'socio_id'       => $socio->id,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => $error['motivo'],
                ]);
                return response()->json($error, 422);
            }

            /* ─────────────────────────────
             * 6. REGISTRO ACCESO
             * ───────────────────────────── */

            $acceso = Acceso::create([
                'socio_id'            => $socio->id,
                'tipo'                => $request->tipo,
                'metodo_verificacion' => 'facial-pgvector',
                'resultado_pdi'       => 'aprobado',
                'similitud_facial'    => 1 - $socio->distance,
                'ip_dispositivo'      => $request->ip(),
                'dispositivo_info'    => $request->userAgent(),
            ]);

            /* ─────────────────────────────
             * 7. NOTIFICACIÓN
             * ───────────────────────────── */

            $this->accesoService->notificarAdmins($acceso);

            Log::info('Acceso registrado', [
                'socio_id' => $socio->id,
                'acceso_id' => $acceso->id,
            ]);

            return response()->json([
                'estado'           => 'exito',
                'id'               => $socio->id,
                'nombres'          => $socio->nombres,
                'apellidos'        => $socio->apellidos,
                'ci'               => $socio->ci,
                'foto_path'        => $socio->foto_path ? asset('storage/' . $socio->foto_path) : null,
                'estado_socio'     => $socio->estado,
                'tipo_membresia'   => $socio->membresiaActiva?->tipo ?? 'Sin membresía',
                'estado_membresia' => $socio->membresiaActiva?->estado ?? '---',
                'fecha_fin'        => $socio->membresiaActiva?->fecha_fin,
                'similaridad'      => round(1 - $socio->distance, 4),
                'mensaje'          => 'Acceso concedido',
            ]);

        } catch (\Exception $e) {

            Log::error('ERROR GENERAL RECONOCIMIENTO', [
                'mensaje' => $e->getMessage(),
                'linea'   => $e->getLine(),
                'archivo' => $e->getFile(),
            ]);

            return response()->json([
                'estado'  => 'error',
                'mensaje' => $e->getMessage(),
            ], 500);
        }
    }
}