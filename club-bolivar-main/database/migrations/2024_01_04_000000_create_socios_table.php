<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('socios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('numero_socio')->unique();
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('ci')->unique();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('telefono')->nullable();
            $table->string('direccion')->nullable();
            $table->enum('tipo_membresia', ['regular', 'vip', 'familiar'])->default('regular');
            $table->enum('estado', ['activo', 'inactivo', 'suspendido', 'vencido'])->default('activo');
            $table->date('fecha_ingreso');
            $table->date('fecha_vencimiento_membresia')->nullable();
            $table->string('foto_path')->nullable();
            $table->string('foto_ci_path')->nullable();
            $table->text('observaciones')->nullable();
            $table->boolean('activo')->default(true);
            $table->boolean('deleted')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('socios');
    }
};