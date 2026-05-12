<?php

namespace App\Services;

use App\Models\Socio;

class AccesoSocioService
{
    public function validarSocio(Socio $socio): ?array
    {
        if ($socio->deleted) {
            return [
                'estado' => 'fallo',
                'motivo' => 'Socio eliminado'
            ];
        }

        if (!$socio->activo) {
            return [
                'estado' => 'fallo',
                'motivo' => 'Socio inactivo'
            ];
        }

        if ($socio->estado === 'bloqueado') {
            return [
                'estado' => 'fallo',
                'motivo' => 'Socio bloqueado'
            ];
        }

        return null;
    }
}