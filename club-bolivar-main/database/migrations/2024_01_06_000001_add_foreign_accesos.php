<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accesos', function (Blueprint $table) {
            $table->foreign('socio_id')->references('id')->on('socios')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('dispositivo_id')->references('id')->on('dispositivos')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('accesos', function (Blueprint $table) {
            $table->dropForeign(['socio_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['dispositivo_id']);
        });
    }
};