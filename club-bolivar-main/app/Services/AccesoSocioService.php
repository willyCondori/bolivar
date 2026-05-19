<?php

namespace App\Services;

use App\Models\Socio;
use App\Models\Acceso;

class AccesoSocioService
{
    /**
     * Valida el estado del socio (eliminado, inactivo, bloqueado).
     * Devuelve null si el socio está habilitado.
     */
    public function validarSocio(?Socio $socio): ?array
    {
        if (!$socio) {
            return $this->error('Socio no encontrado');
        }

        $motivo = match (true) {
            $socio->deleted === true       => 'Socio eliminado',
            !$socio->activo                => 'Socio inactivo',
            $socio->estado === 'bloqueado' => 'Socio bloqueado',
            default                        => null,
        };

        return $motivo ? $this->error($motivo) : null;
    }

    /**
     * Verifica que el tipo de acceso solicitado sea el correcto
     * según el último registro del socio.
     *
     * Regla: los accesos deben alternar estrictamente entrada → salida → entrada...
     * - Si el último acceso fue 'entrada', el siguiente debe ser 'salida'.
     * - Si el último acceso fue 'salida' (o no hay ninguno), el siguiente debe ser 'entrada'.
     *
     * Devuelve null si la secuencia es correcta.
     */
    // DESPUÉS — usa el objeto Socio completo para que Eloquent resuelva la FK correcta
    public function verificarSecuenciaAcceso(Socio $socio, string $tipoSolicitado): ?array
    {
        $ultimoAcceso = Acceso::where('socio_id', $socio->id)
            ->select('tipo', 'created_at')
            ->latest()
            ->first();

        // Sin historial: solo se permite entrada
        if (!$ultimoAcceso) {
            if ($tipoSolicitado === 'salida') {
                return [
                    'estado'  => 'fallo',
                    'motivo'  => 'No se puede registrar una salida sin una entrada previa.',
                    'mensaje' => 'Ya se registro una entrada.',
                ];
            }
            return null;
        }

        $tipoEsperado = $ultimoAcceso->tipo === 'entrada' ? 'salida' : 'entrada';

        if ($tipoSolicitado !== $tipoEsperado) {
            $descripcion = $tipoSolicitado === 'entrada'
                ? 'No se puede registrar una entrada sin haber registrado una salida primero.'
                : 'No se puede registrar una salida sin haber registrado una entrada primero.';

            return [
                'estado'        => 'fallo',
                'motivo'        => $descripcion,
                'mensaje'       => "Ya se registro: se esperaba {$tipoEsperado}.",
                'ultimo_tipo'   => $ultimoAcceso->tipo,
                'ultimo_acceso' => $ultimoAcceso->created_at,
            ];
        }

        return null;
    }

    /**
     * Notifica a todos los administradores sobre un acceso registrado.
     */
    public function notificarAdmins(\App\Models\Acceso $acceso): void
    {
        \App\Models\User::whereHas('role', fn($q) => $q->where('nombre', 'admin'))
            ->select('id')
            ->get()
            ->each(fn($admin) => $admin->notify(new \App\Notifications\AccesoRegistradoNotification($acceso)));
    }

    // ─────────────────────────────────────────────
    // Privados
    // ─────────────────────────────────────────────

    private function error(string $motivo): array
    {
        return [
            'estado' => 'fallo',
            'motivo' => $motivo,
        ];
    }
}