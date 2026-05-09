<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReconocimientoController;
use App\Http\Controllers\SocioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\MembresiaController;
use App\Models\Socio;
use App\Http\Controllers\BloqueoSocioController;

// --- PÚBLICO ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('home');


Route::middleware(['auth'])->group(function () {

    // Dashboard — todos los roles
    Route::get('/dashboard', function () {
        $user = Auth::user();

        if ($user->role && $user->role->nombre === 'socio') {
            return redirect()->route('socio.panel');
        }

        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ===============================
    // 🔹 SOLO ADMIN Y OPERADOR
    // ===============================
    Route::middleware(['role:admin,operador'])->group(function () {

        // Accesos
        Route::prefix('accesos')->group(function () {
            Route::get('/reconocimiento', fn() =>
                Inertia::render('Accesos/Reconocimiento')
            )->name('reconocimiento.index');

            Route::get('/ingresos/facial', fn() =>
                Inertia::render('Accesos/Ingresos/ReconocimientoFacial')
            )->name('accesos.facial');

            Route::get('/ingresos/qr', fn() =>
                Inertia::render('Accesos/Ingresos/EscaneoQR')
            )->name('accesos.qr');

            Route::post('/reconocer', [ReconocimientoController::class, 'verificar'])
                ->name('accesos.reconocer');

            Route::get('/membresias', [MembresiaController::class, 'index'])
                ->name('accesos.membresias');
        });

        // Reportes
        Route::get('/reportes/ingresos', fn() =>
            Inertia::render('Accesos/Reportes/ReporteIngresos')
        )->name('reportes.ingresos');
    });

    // ===============================
    // 🔹 SOLO ADMIN
    // ===============================
    Route::middleware(['role:admin'])->group(function () {

        // Socios
        Route::prefix('socios')->group(function () {
            Route::get('/',               [SocioController::class, 'index'])  ->name('socios.index');
            Route::get('/registrar',      fn() => Inertia::render('Accesos/Socios/RegistrarSocio'))->name('socios.create');
            Route::post('/guardar',       [SocioController::class, 'store'])  ->name('socios.store');
            Route::delete('/{socio}',     [SocioController::class, 'destroy'])->name('socios.destroy');
            Route::patch('/{socio}/restore', [SocioController::class, 'restore'])->name('socios.restore');
            Route::get('/{socio}/bloquear',  [BloqueoSocioController::class, 'show'])     ->name('socios.bloquear.show');
            Route::post('/{socio}/bloquear', [BloqueoSocioController::class, 'execute'])  ->name('socios.bloquear');
            Route::patch('/{socio}/desbloquear', [BloqueoSocioController::class, 'desbloquear'])->name('socios.desbloquear');
        });

        Route::get('/{socio}/editar', [SocioController::class, 'edit'])
            ->name('socios.edit');
        Route::match(['put', 'patch'], '/{socio}', [SocioController::class, 'update'])
            ->name('socios.update');
    });

    // ===============================
    // 🔹 SOLO SOCIO
    // ===============================
    Route::middleware(['role:socio'])->group(function () {
        Route::get('/socio/panel', function () {
            $user  = Auth::user();
            $socio = Socio::with('membresiaActiva')->where('user_id', $user->id)->first();

            return Inertia::render('Accesos/Socios/Panel', [
                'user'      => $user,
                'socio'     => $socio,
                'membresia' => $socio?->membresiaActiva,
            ]);
        })->name('socio.panel');
    });

    // ===============================
    // 🔹 PERFIL — todos los roles
    // ===============================
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile',    'edit')   ->name('profile.edit');
        Route::patch('/profile',  'update') ->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });
});

require __DIR__.'/auth.php';