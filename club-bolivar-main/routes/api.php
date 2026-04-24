<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\Api\SocioRegistrationController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\AccesoQRController;


// ===============================
// 🔹 LOGIN
// ===============================
Route::post('/login', function (Request $request) {

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    $token = $user->createToken('web')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ],
    ]);
});


// ===============================
// 🔹 REPORTES (SIN AUTH para pruebas)
// ===============================
Route::get('/reportes/ingresos', [ReporteController::class, 'ingresos']);


// ===============================
// 🔹 QR
// ===============================
Route::post('/accesos/qr', [AccesoQRController::class, 'validarQR']);


// ===============================
// 🔹 PROTEGIDAS (SANCTUM)
// ===============================
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user());

    Route::get('/audit-logs', function () {
        return DB::table('audit_logs')
            ->orderBy('fecha_hora', 'desc')
            ->limit(50)
            ->get();
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    });

    Route::post('/socios/registro', [SocioRegistrationController::class, 'store']);
});