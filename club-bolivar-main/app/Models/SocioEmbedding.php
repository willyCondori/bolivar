<?php
// app/Models/SocioEmbedding.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SocioEmbedding extends Model
{
    protected $table = 'socio_embeddings';
    public $timestamps = false;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'socio_id', 'embedding', 'etiqueta', 'confianza', 'created_at'
    ];

    public function socio()
    {
        return $this->belongsTo(Socio::class);
    }
}