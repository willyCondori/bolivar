<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accesos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('socio_id');
            $table->uuid('user_id')->nullable();
            $table->uuid('dispositivo_id')->nullable();
            $table->enum('tipo', ['entrada', 'salida']);
            $table->enum('metodo_verificacion', ['facial', 'manual', 'qr'])->default('facial');
            $table->enum('resultado_pdi', ['aprobado', 'rechazado', 'no_verificado'])->default('no_verificado');
            $table->decimal('similitud_facial', 5, 2)->nullable();
            $table->string('foto_captura_path')->nullable();
            $table->string('ip_dispositivo')->nullable();
            $table->string('dispositivo_info')->nullable();
            $table->text('observaciones')->nullable();
            $table->boolean('deleted')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accesos');
    }
};