<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {

    public function up(): void
    {
        DB::statement('DROP INDEX IF EXISTS socios_embedding_idx');

        DB::statement("
            ALTER TABLE socios
            ALTER COLUMN embedding
            TYPE vector(128)
        ");

        DB::statement("
            CREATE INDEX IF NOT EXISTS socios_embedding_idx
            ON socios
            USING hnsw (embedding vector_cosine_ops)
        ");
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS socios_embedding_idx');

        DB::statement("
            ALTER TABLE socios
            ALTER COLUMN embedding
            TYPE vector(512)
        ");
    }
};