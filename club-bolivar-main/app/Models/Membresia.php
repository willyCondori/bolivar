<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Membresia extends Model
{
    public $timestamps = false;

    protected $table = 'membresias';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'socio_id',
        'tipo',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'deleted',
    ];

    protected $casts = [
        'deleted'      => 'boolean',
        'fecha_inicio' => 'date',
        'fecha_fin'    => 'date',
    ];

    /* ── Boot optimizado ─────────────────────────────────────────── */

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->id = $model->id ?? (string) Str::uuid();
        });
    }

    /* ── Relaciones ─────────────────────────────────────────────── */

    public function socio()
    {
        return $this->belongsTo(Socio::class, 'socio_id');
    }

    /* ── Scopes optimizados ─────────────────────────────────────── */

    public function scopeActiva($query)
    {
        return $query->where([
            ['estado', '=', 'activo'],
            ['deleted', '=', false],
        ])->where('fecha_fin', '>=', now()->toDateString());
    }

    public function scopeNoEliminadas($query)
    {
        return $query->where('deleted', false);
    }

    public function scopeVigentes($query)
    {
        return $query->where('fecha_fin', '>=', now()->toDateString());
    }
}