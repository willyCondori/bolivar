<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispositivos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->enum('tipo', ['camara', 'tablet', 'panel']);
            $table->string('ubicacion')->nullable();
            $table->string('token_dispositivo')->unique();
            $table->boolean('activo')->default(true);
            $table->boolean('deleted')->default(false);
            $table->timestamp('ultimo_ping_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispositivos');
    }
};