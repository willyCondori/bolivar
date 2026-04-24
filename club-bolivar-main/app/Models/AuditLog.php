<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    // Esta tabla no necesita updated_at
    const UPDATED_AT = null;

    protected $table = 'audit_logs';

    protected $fillable = [
        'tabla_afectada',
        'registro_id',
        'accion',
        'datos_anteriores',
        'datos_nuevos',
        'usuario_id',
        'ip_address',
        'user_agent',
        'modulo',
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos'     => 'array',
    ];

    // Relacion opcional: a qué usuario pertenece este log
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}