<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AccesoRegistradoNotification extends Notification
{
    use Queueable;

    public $acceso;

    public function __construct($acceso)
    {
        $this->acceso = $acceso;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'titulo'    => 'Acceso registrado',
            'mensaje'   => 'Se registró una ' . $this->acceso->tipo . ' correctamente.',
            'tipo'      => $this->acceso->tipo,
            'socio_id'  => $this->acceso->socio_id,
            'acceso_id' => $this->acceso->id,
            'nombres'   => $this->acceso->socio->nombres ?? 'Desconocido',  // ← agregar
            'apellidos' => $this->acceso->socio->apellidos ?? '',            // ← agregar
            'fecha'     => now(),
        ];
    }
}