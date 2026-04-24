<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;

class AuditObserver
{
    public function created(Model $modelo): void
    {
        $this->registrar('create', $modelo, [], $modelo->getAttributes());
    }

    public function updated(Model $modelo): void
    {
        $this->registrar('update', $modelo, $modelo->getOriginal(), $modelo->getChanges());
    }

    public function deleted(Model $modelo): void
    {
        $this->registrar('delete', $modelo, $modelo->getAttributes(), []);
    }

    private function registrar(string $accion, Model $modelo, array $anterior, array $nuevo): void
    {
        if ($modelo->getTable() === 'audit_logs') {
            return;
        }

        $agente = new Agent();
        $agente->setUserAgent(Request::userAgent());

        $navegador        = $agente->browser() ?: 'Desconocido';
        $versionNavegador = $agente->version($navegador) ?: '';
        $so               = $agente->platform() ?: 'Desconocido';
        $versionSo        = $agente->version($so) ?: '';

        DB::table('audit_logs')->insert([
            'id'               => Str::uuid(),
            'user_id'          => Auth::id(),
            'accion'           => $accion,
            'modelo_afectado'  => $modelo->getTable(),
            'modelo_id'        => $modelo->getKey(),
            'datos_anteriores' => empty($anterior) ? null : json_encode($anterior),
            'datos_nuevos'     => empty($nuevo)    ? null : json_encode($nuevo),
            'ip_address'       => Request::ip(),
            'user_agent'       => Request::userAgent(),
            'navegador'        => $navegador . ($versionNavegador ? ' ' . $versionNavegador : ''),
            'sistema_operativo'=> $so . ($versionSo ? ' ' . $versionSo : ''),
            'fecha_hora'       => now(),
            'deleted'          => false,
        ]);
    }
}