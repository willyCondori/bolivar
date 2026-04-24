<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('navegador')->nullable()->after('user_agent');
            $table->string('sistema_operativo')->nullable()->after('navegador');
            $table->timestamp('fecha_hora')->nullable()->after('sistema_operativo');
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropColumn(['navegador', 'sistema_operativo', 'fecha_hora']);
        });
    }
};