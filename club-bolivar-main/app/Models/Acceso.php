<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Acceso extends Model
{
    protected $table = 'accesos';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'socio_id',
        'user_id',
        'dispositivo_id',
        'tipo',
        'metodo_verificacion',
        'resultado_pdi',
        'similitud_facial',
        'ip_dispositivo',
        'dispositivo_info'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
}
