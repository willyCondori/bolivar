<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {

    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        Schema::table('socios', function (Blueprint $table) {

            if (!Schema::hasColumn('socios', 'embedding')) {
                $table->vector('embedding', 512)->nullable();
            }

            if (!Schema::hasColumn('socios', 'embedding_updated_at')) {
                $table->timestamp('embedding_updated_at')->nullable();
            }

            if (!Schema::hasColumn('socios', 'sync_version')) {
                $table->bigInteger('sync_version')->default(1)->nullable();
            }
        });

        DB::statement("
            CREATE INDEX IF NOT EXISTS socios_embedding_idx
            ON socios
            USING hnsw (embedding vector_cosine_ops)
        ");
    }
    
    public function down(): void
    {
        Schema::table('socios', function (Blueprint $table) {

            if (Schema::hasColumn('socios', 'embedding')) {
                $table->dropColumn('embedding');
            }

            if (Schema::hasColumn('socios', 'embedding_updated_at')) {
                $table->dropColumn('embedding_updated_at');
            }

            if (Schema::hasColumn('socios', 'sync_version')) {
                $table->dropColumn('sync_version');
            }
        });
    }
};