<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CaducarMembresias extends Command
{
    protected $signature   = 'membresias:caducar';
    protected $description = 'Marca como caducado todas las membresías activas cuya fecha_fin ya pasó';

    public function handle(): int
    {
        $afectadas = DB::table('membresias')
            ->where('estado', 'activo')
            ->where('deleted', false)
            ->whereDate('fecha_fin', '<', now()->toDateString())
            ->update(['estado' => 'caducado']);

        $this->info("✅ {$afectadas} membresía(s) marcadas como caducadas.");

        return self::SUCCESS;
    }
}