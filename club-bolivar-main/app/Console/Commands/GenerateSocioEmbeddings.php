<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Socio;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class GenerateSocioEmbeddings extends Command
{
    protected $signature = 'socios:embeddings';
    protected $description = 'Genera embeddings para socios existentes';

    public function handle()
    {
        $socios = Socio::whereNull('embedding')
            ->whereNotNull('foto_path')
            ->get();

        $this->info("Socios a procesar: " . $socios->count());

        foreach ($socios as $socio) {

            try {
                $path = storage_path('app/public/' . $socio->foto_path);

                if (!file_exists($path)) {
                    $this->warn("No existe foto: {$socio->id}");
                    continue;
                }

                /* ─────────────────────────────
                 * 1. LLAMADA A FASTAPI
                 * ───────────────────────────── */
                $response = Http::timeout(60)
                    ->attach(
                        'file',
                        file_get_contents($path),
                        basename($path)
                    )
                    ->post(env('FACIAL_API_URL') . '/embedding');

                if (
                    !$response->successful() ||
                    !$response->json('embedding')
                ) {
                    $this->error("Error embedding socio: {$socio->id}");
                    continue;
                }

                $embedding = $response->json('embedding');

                if (!is_array($embedding)) {
                    $this->error("Embedding inválido: {$socio->id}");
                    continue;
                }

                /* ─────────────────────────────
                 * 2. FORMATO CORRECTO PGVECTOR
                 * ───────────────────────────── */
                $vector = '[' . implode(',', array_map('floatval', $embedding)) . ']';

                /* ─────────────────────────────
                 * 3. GUARDAR EN POSTGRES (FIX CRÍTICO)
                 * ───────────────────────────── */
                DB::table('socios')
                    ->where('id', $socio->id)
                    ->update([
                        'embedding' => DB::raw("'$vector'::vector"),
                        'embedding_updated_at' => now(),
                        'sync_version' => 1,
                    ]);

                $this->info("OK: {$socio->id}");

            } catch (\Exception $e) {

                $this->error("Exception: {$socio->id} - " . $e->getMessage());

                logger()->error('ERROR EMBEDDING SOCIO', [
                    'socio_id' => $socio->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Proceso finalizado.");
    }
}