<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membresias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('socio_id');
            $table->enum('tipo', ['regular', 'vip', 'familiar'])->default('regular');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->enum('estado', ['activo', 'vencido', 'cancelado'])->default('activo');
            $table->boolean('deleted')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membresias');
    }
};