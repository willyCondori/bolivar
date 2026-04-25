<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Membresia extends Model
{
    // La tabla no usa timestamps de Laravel (created_at/updated_at por defecto)
    public $timestamps = false;

    protected $table = 'membresias';

    protected $fillable = [
        'id',
        'socio_id',
        'tipo',           
        'fecha_inicio',
        'fecha_fin',
        'monto_pagado',
        'estado',         // activo | vencido | cancelado
        'comprobante_path',
        'deleted',
    ];

    protected $casts = [
        'deleted'      => 'boolean',
        'fecha_inicio' => 'date',
        'fecha_fin'    => 'date',
    ];

    // UUID manual
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function getIncrementing() { return false; }
    public function getKeyType()      { return 'string'; }

    /* ── Relaciones ─────────────────────────────────────────────────── */
    public function socio()
    {
        return $this->belongsTo(Socio::class);
    }

    /* ── Scopes ─────────────────────────────────────────────────────── */
    public function scopeActiva($query)
    {
        return $query->where('estado', 'activo')
                     ->where('deleted', false)
                     ->where('fecha_fin', '>=', now()->toDateString());
    }
}