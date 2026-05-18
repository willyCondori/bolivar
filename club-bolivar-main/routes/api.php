<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Api\SocioRegistrationController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\AccesoQRController;
use App\Http\Controllers\ReconocimientoController;
use App\Http\Api\SocioApiController;

/* ─────────────────────────────
| 🔹 LOGIN
└─────────────────────────────*/
Route::post('/login', function (Request $request) {
    $user = User::select('id', 'name', 'email', 'password')
        ->whereHas('role')
        ->where('email', $request->email)
        ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    $token = $user->createToken('apk-gym')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role?->nombre,
        ],
    ]);
});

/* ─────────────────────────────
| 🔹 PÚBLICAS (sin auth — APK sin login)
└─────────────────────────────*/
Route::get('/reportes/ingresos', [ReporteController::class, 'ingresos']);

Route::post('/accesos/qr', [AccesoQRController::class, 'validarQR']);

Route::post('/accesos/facial', [ReconocimientoController::class, 'verificar']);

Route::get('/socios/sync', [SocioApiController::class, 'sync']);

/* ─────────────────────────────
| 🔹 PROTEGIDAS (SANCTUM)
└─────────────────────────────*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user());

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    });

    Route::get('/audit-logs', function () {
        return DB::table('audit_logs')
            ->select('id', 'fecha_hora', 'accion', 'usuario_id')
            ->latest('fecha_hora')
            ->limit(50)
            ->get();
    });

    Route::post('/socios/registro', [SocioRegistrationController::class, 'store']);
});