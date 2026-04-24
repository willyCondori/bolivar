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
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_ingreso' => 'date',
        'fecha_vencimiento_membresia' => 'date',
        'activo' => 'boolean',
        'deleted' => 'boolean',
    ];

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}