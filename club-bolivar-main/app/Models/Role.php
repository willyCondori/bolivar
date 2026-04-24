<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Role extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
        'deleted',
    ];

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = Str::uuid();
            }
        });
    }

    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}