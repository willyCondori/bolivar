<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('intentos_acceso_fallidos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('socio_id')->nullable();
            $table->uuid('dispositivo_id')->nullable();
            $table->string('foto_captura_path')->nullable();
            $table->decimal('similitud_facial', 5, 2)->nullable();
            $table->string('ip_dispositivo')->nullable();
            $table->string('motivo_rechazo')->nullable();
            $table->boolean('deleted')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intentos_acceso_fallidos');
    }
};