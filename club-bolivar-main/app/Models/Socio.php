<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Auditable;

class Socio extends Model
{
    use Auditable;

    protected $table = 'socios';

    protected $fillable = [
        'user_id',
        'numero_socio',
        'nombres',
        'apellidos',
        'ci',
        'fecha_nacimiento',
        'email',
        'telefono',
        'direccion',
        // tipo_membresia se mantiene por datos existentes,
        // pero el tipo real de membresía vive en la tabla membresias.
        'tipo_membresia',
        'estado',
        'estado_aprobacion',
        'fecha_ingreso',
        'fecha_vencimiento_membresia',
        'foto_path',
        'foto_ci_path',
        'observaciones',
        'activo',
        'deleted',
        'qr_token',
    ];

    protected $casts = [
        'fecha_nacimiento'            => 'date',
        'fecha_ingreso'               => 'date',
        'fecha_vencimiento_membresia' => 'date',
        'activo'                      => 'boolean',
        'deleted'                     => 'boolean',
    ];

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps   = false;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /* ── Relaciones ─────────────────────────────────────────────────── */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Todas las membresías históricas del socio */
    public function membresias()
    {
        return $this->hasMany(Membresia::class, 'socio_id');
    }

    /** La membresía activa y vigente más reciente */
    public function membresiaActiva()
    {
        return $this->hasOne(Membresia::class, 'socio_id')
            ->latest('fecha_inicio');
    }
}