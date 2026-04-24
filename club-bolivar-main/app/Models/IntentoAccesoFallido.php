<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class IntentoAccesoFallido extends Model
{
    protected $table = 'intentos_acceso_fallidos';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'socio_id',
        'dispositivo_id',
        'foto_captura_path',
        'similitud_facial',
        'ip_dispositivo',
        'motivo_rechazo'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    // 🔥 RELACIÓN (CLAVE PARA QUE NO ROMPA)
    public function socio()
    {
        return $this->belongsTo(Socio::class);
    }

    protected $casts = [
        'created_at' => 'datetime',
    ];
}