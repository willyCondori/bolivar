<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSocioRegistrationRequest;
use App\Models\Socio;
use App\Services\MembershipNumberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class SocioRegistrationController extends Controller
{
    public function store(
        StoreSocioRegistrationRequest $request,
        MembershipNumberService $membershipNumberService
    ): JsonResponse {
        $photoPath = null;

        try {
            $photoPath = $request->file('fotografia')->store('socios/fotos', 'public');

            $socio = DB::transaction(function () use ($request, $membershipNumberService, $photoPath) {
                $numeroSocio = $membershipNumberService->nextSocioNumber();

                return Socio::create([
                    'user_id' => null,
                    'numero_socio' => $numeroSocio,
                    'nombres' => $request->nombres,
                    'apellidos' => $request->apellidos,
                    'ci' => $request->ci,
                    'fecha_nacimiento' => $request->fecha_nacimiento,
                    'email' => $request->email,
                    'telefono' => $request->telefono,
                    'direccion' => $request->direccion,
                    'tipo_membresia' => $request->tipo_membresia ?? 'regular',
                    'estado' => 'inactivo',
                    'estado_aprobacion' => 'pendiente',
                    'fecha_ingreso' => now()->toDateString(),
                    'fecha_vencimiento_membresia' => null,
                    'foto_path' => $photoPath,
                    'foto_ci_path' => null,
                    'observaciones' => $request->observaciones,
                    'activo' => true,
                    'deleted' => false,
                ]);
            });

            return response()->json([
                'message' => 'Registro de socio completado correctamente.',
                'data' => [
                    'id' => $socio->id,
                    'numero_socio' => $socio->numero_socio,
                    'nombres' => $socio->nombres,
                    'apellidos' => $socio->apellidos,
                    'ci' => $socio->ci,
                    'email' => $socio->email,
                    'telefono' => $socio->telefono,
                    'tipo_membresia' => $socio->tipo_membresia,
                    'estado_aprobacion' => $socio->estado_aprobacion,
                    'foto_path' => $socio->foto_path,
                ],
            ], 201);
        } catch (Throwable $e) {
            if ($photoPath && Storage::disk('public')->exists($photoPath)) {
                Storage::disk('public')->delete($photoPath);
            }

            report($e);

            return response()->json([
                'message' => 'No se pudo completar el registro del socio.',
                'error' => app()->environment('local') ? $e->getMessage() : 'Error interno del servidor.',
            ], 500);
        }
    }
}