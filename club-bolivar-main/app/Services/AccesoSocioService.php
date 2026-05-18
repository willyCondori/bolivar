<?php

namespace App\Services;

use App\Models\Socio;

class AccesoSocioService
{
    public function validarSocio(Socio $socio): ?array
    {
        $estado = match (true) {
            $socio->deleted === true => 'Socio eliminado',
            !$socio->activo => 'Socio inactivo',
            $socio->estado === 'bloqueado' => 'Socio bloqueado',
            default => null,
        };

        return $estado ? $this->error($estado) : null;
    }

    private function error(string $motivo): array
    {
        return [
            'estado' => 'fallo',
            'motivo' => $motivo,
        ];
    }
}