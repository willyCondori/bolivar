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

                // pgvector devuelve el embedding como string "[0.1,0.2,...]"
                // necesitamos convertirlo a array de floats para Flutter
                $embedding = $s->embedding;

                if (is_string($embedding)) {
                    // quitar corchetes y convertir a array de floats
                    $embedding = json_decode(
                        str_replace(['[', ']'], ['[', ']'], $embedding),
                        true
                    );
                }

                // si sigue siendo string con formato pgvector: {0.1,0.2,...}
                if (is_string($embedding)) {
                    $embedding = array_map(
                        'floatval',
                        explode(',', trim($embedding, '{}[]'))
                    );
                }

                return [
                    'id'            => $s->id,
                    'nombres'       => $s->nombres,
                    'apellidos'     => $s->apellidos,
                    'ci'            => $s->ci,
                    'telefono'      => $s->telefono,
                    'estado'        => $s->estado,
                    'membresia'     => optional($s->membresia)->tipo,
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