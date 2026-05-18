<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Acceso;
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

            $imagen = $request->file('imagen');

            Log::info('📸 Inicio reconocimiento facial', [
                'ip' => $request->ip(),
                'tipo' => $request->tipo
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
                'body'   => $response->body()
            ]);

            if (!$response->successful()) {

                Log::error('❌ Error FastAPI embedding', [
                    'body' => $response->body()
                ]);

                return response()->json([
                    'estado' => 'error',
                    'mensaje' => 'No se pudo generar embedding'
                ], 500);
            }

            $embedding = $response->json('embedding');

            if (!$embedding || !is_array($embedding)) {

                Log::error('❌ Embedding inválido', [
                    'response' => $response->json()
                ]);

                return response()->json([
                    'estado' => 'error',
                    'mensaje' => 'Embedding inválido'
                ], 500);
            }

            $vector = '[' . implode(',', $embedding) . ']';

            /* ─────────────────────────────
             * 2. PGVECTOR SEARCH
             * ───────────────────────────── */
            $socio = Socio::select('id', 'nombres', 'apellidos', 'foto_path', 'activo', 'estado', 'deleted')
                ->selectRaw("embedding <=> ? as distance", [$vector])
                ->whereNotNull('embedding')
                ->orderBy('distance')
                ->first();

            Log::info('🔎 Resultado pgvector', [
                'socio' => $socio?->id,
                'socio' => $socio?->nombres,
                'distance' => $socio?->distance ?? null
            ]);

            if (!$socio || $socio->distance > 0.7) {

                IntentoAccesoFallido::create([
                    'socio_id' => null,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => 'No identificado (pgvector)',
                ]);

                return response()->json([
                    'estado' => 'fallo',
                    'mensaje' => 'No identificado'
                ]);
            }

            /* ─────────────────────────────
             * 3. VALIDACIÓN NEGOCIO
             * ───────────────────────────── */

            $validator = new AccesoSocioService();
            $estado = $validator->validarSocio($socio);

            if ($estado) {

                Log::warning('⚠️ Socio rechazado por negocio', [
                    'socio_id' => $socio->id,
                    'motivo' => $estado['motivo']
                ]);

                IntentoAccesoFallido::create([
                    'socio_id' => $socio->id,
                    'ip_dispositivo' => $request->ip(),
                    'motivo_rechazo' => $estado['motivo'],
                ]);

                return response()->json($estado, 403);
            }

            /* ─────────────────────────────
             * 4. BLOQUEO 3 MIN
             * ───────────────────────────── */

            $limite = now()->subMinutes(3);

            $ultimo = Acceso::where('socio_id', $socio->id)
                ->where('tipo', 'entrada')
                ->where('created_at', '>=', $limite)
                ->latest()
                ->first();

            if ($request->tipo === 'entrada' && $ultimo) {

                Log::warning('⛔ Bloqueo temporal', [
                    'socio_id' => $socio->id,
                    'ultimo_acceso' => $ultimo->created_at
                ]);

                return response()->json([
                    'estado' => 'bloqueado',
                    'mensaje' => 'Ya existe una entrada reciente (3 min)',
                ], 429);
            }

            /* ─────────────────────────────
             * 5. REGISTRO ACCESO
             * ───────────────────────────── */

            $acceso = Acceso::create([
                'socio_id' => $socio->id,
                'tipo' => $request->tipo,
                'metodo_verificacion' => 'facial-pgvector',
                'resultado_pdi' => 'aprobado',
                'similitud_facial' => 1 - $socio->distance,
                'ip_dispositivo' => $request->ip(),
                'dispositivo_info' => $request->userAgent(),
            ]);

            /* ─────────────────────────────
             * 6. NOTIFICACIÓN
             * ───────────────────────────── */

            $admins = User::whereHas('role', function ($q) {
                $q->where('nombre', 'admin');
            })->get();

            foreach ($admins as $admin) {
                $admin->notify(new AccesoRegistradoNotification($acceso));
            }

            Log::info('✅ Acceso registrado', [
                'socio_id' => $socio->id,
                'acceso_id' => $acceso->id
            ]);

            return response()->json([
                'estado' => 'exito',
                'id' => $socio->id,
                'nombres' => $socio->nombres,
                'apellidos' => $socio->apellidos,
                'similaridad' => 1 - $socio->distance,
                'mensaje' => 'Acceso concedido'
            ]);

        } catch (\Exception $e) {

            Log::error('🔥 ERROR GENERAL RECONOCIMIENTO', [
                'mensaje' => $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
            ]);

            return response()->json([
                'estado' => 'error',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }
}