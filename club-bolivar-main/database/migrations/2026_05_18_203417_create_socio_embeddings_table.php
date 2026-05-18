<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Habilitar extensión si no está
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        DB::statement('
            CREATE TABLE IF NOT EXISTS socio_embeddings (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                socio_id uuid NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
                embedding vector(512) NOT NULL,
                etiqueta varchar(50) DEFAULT \'frontal\',
                confianza float,
                created_at timestamp DEFAULT now()
            )
        ');

        DB::statement('
            CREATE INDEX IF NOT EXISTS socio_embeddings_hnsw_idx
            ON socio_embeddings
            USING hnsw (embedding vector_cosine_ops)
        ');
    }

    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS socio_embeddings');
    }
};