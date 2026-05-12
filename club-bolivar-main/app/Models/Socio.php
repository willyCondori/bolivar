<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Auditable;

class Socio extends Model
{
    use Auditable;

    protected $table = 'socios';

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

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
        'estado',
        'estado_aprobacion',
        'fecha_ingreso',
        'foto_path',
        'observaciones',
        'activo',
        'deleted',
        'qr_token',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_ingreso'    => 'date',
        'activo'           => 'boolean',
        'deleted'          => 'boolean',
    ];

    /* ── Boot optimizado ─────────────────────────────────────────── */

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->id = $model->id ?? (string) Str::uuid();
        });
    }

    /* ── Relaciones ─────────────────────────────────────────────── */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function membresias()
    {
        return $this->hasMany(Membresia::class, 'socio_id');
    }

    /**
     * Membresia activa optimizada (SIN orderBy pesado en relación)
     */
    public function membresiaActiva()
    {
        return $this->hasOne(Membresia::class, 'socio_id')
            ->where([
                ['estado', '=', 'activo'],
                ['deleted', '=', false],
            ])
            ->latest('fecha_inicio');
    }

    /* ── Scopes útiles para performance ─────────────────────────── */

    public function scopeActivos($query)
    {
        return $query->where([
            ['estado', '=', 'activo'],
            ['deleted', '=', false],
        ]);
    }

    public function scopeInactivos($query)
    {
        return $query->where('estado', 'inactivo');
    }

    public function scopeBloqueados($query)
    {
        return $query->where('estado', 'bloqueado');
    }
}