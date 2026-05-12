<?php

namespace App\Services;

use App\Models\Socio;

class AccesoSocioService
{
    public function validarSocio(Socio $socio): ?array
    {

        if ($socio->deleted) {
            return $this->respuesta('Socio eliminado');
        }

        if (!$socio->activo) {
            return $this->respuesta('Socio inactivo');
        }

        if ($socio->estado === 'bloqueado') {
            return $this->respuesta('Socio bloqueado');
        }

        return null;
    }

    private function respuesta(string $motivo): array
    {
        return [
            'estado' => 'fallo',
            'motivo' => $motivo,
        ];
    }
}