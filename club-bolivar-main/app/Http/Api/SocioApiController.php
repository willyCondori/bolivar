<?php

namespace App\Http\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;

class SocioApiController extends Controller
{
    public function sync()
    {
        $socios = Socio::select(
                'id',
                'nombres',
                'apellidos',
                'ci',
                'telefono',
                'estado',
                'qr_token',
                'foto_path',
                'embedding',
                'sync_version'
            )
            ->whereNotNull('embedding')
            ->where('estado', 'activo')
            ->where('deleted', 0)
            ->get()
            ->map(function ($s) {

                $embedding = $s->embedding;

                // Caso pgvector string: "[0.1,0.2,...]"
                if (is_string($embedding)) {
                    $clean = trim($embedding, '[]{}');

                    $embedding = array_map(
                        'floatval',
                        explode(',', $clean)
                    );
                }

                return [
                    'id'            => $s->id,
                    'nombres'       => $s->nombres,
                    'apellidos'     => $s->apellidos,
                    'ci'            => $s->ci,
                    'telefono'      => $s->telefono,
                    'estado'        => $s->estado,
                    'membresia'     => optional($s->membresia)->tipo ?? null,
                    'qr_token'      => $s->qr_token,

                    'foto_url'      => $s->foto_path
                        ? asset('storage/' . $s->foto_path)
                        : null,

                    'embedding'     => $embedding,
                    'sync_version'  => $s->sync_version,
                ];
            });

        return response()->json($socios);
    }
}