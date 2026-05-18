<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReconocimientoController;
use App\Http\Controllers\SocioController;
use App\Http\Controllers\MembresiaController;
use App\Http\Controllers\BloqueoSocioController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Socio;

/* ─────────────────────────────
| 🔹 PÚBLICO
└─────────────────────────────*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('home');

Route::post('/{socio}/embeddings', [SocioController::class, 'agregarEmbedding'])
    ->name('socios.embeddings.store');
/* ─────────────────────────────
| 🔹 AUTH GENERAL
└─────────────────────────────*/

Route::middleware(['auth'])->group(function () {

    // 🔥 OPTIMIZACIÓN: evitar lógica pesada en closure
    Route::get('/dashboard', function () {
        $user = Auth::user();

        if ($user?->role?->nombre === 'socio') {
            return redirect()->route('socio.panel');
        }

        return Inertia::render('Dashboard');
    })->name('dashboard');


    /* ─────────────────────────────
    | 🔹 ADMIN + OPERADOR
    └─────────────────────────────*/
    Route::middleware(['role:admin,operador'])->group(function () {

        Route::prefix('accesos')->group(function () {

            Route::get('/reconocimiento', fn () =>
                Inertia::render('Accesos/Reconocimiento')
            )->name('reconocimiento.index');

            Route::get('/ingresos/facial', fn () =>
                Inertia::render('Accesos/Ingresos/ReconocimientoFacial')
            )->name('accesos.facial');

            Route::get('/ingresos/qr', fn () =>
                Inertia::render('Accesos/Ingresos/EscaneoQR')
            )->name('accesos.qr');

            Route::post('/reconocer', [ReconocimientoController::class, 'verificar'])
                ->name('accesos.reconocer');

            Route::get('/membresias', [MembresiaController::class, 'index'])
                ->name('accesos.membresias');
        });

        Route::get('/reportes/ingresos', fn () =>
            Inertia::render('Accesos/Reportes/ReporteIngresos')
        )->name('reportes.ingresos');

        Route::get('/notificaciones', [NotificationController::class, 'index'])
            ->name('notificacion.index');
    });


    /* ─────────────────────────────
    | 🔹 SOLO ADMIN
    └─────────────────────────────*/
    Route::middleware(['role:admin'])->group(function () {

        Route::prefix('socios')->group(function () {

            Route::get('/', [SocioController::class, 'index'])
                ->name('socios.index');

            Route::get('/registrar', fn () =>
                Inertia::render('Accesos/Socios/RegistrarSocio')
            )->name('socios.create');

            Route::post('/', [SocioController::class, 'store'])
                ->name('socios.store');

            Route::delete('/{socio}', [SocioController::class, 'destroy'])
                ->name('socios.destroy');

            Route::patch('/{socio}/restore', [SocioController::class, 'restore'])
                ->name('socios.restore');

            Route::get('/{socio}/bloquear', [BloqueoSocioController::class, 'show'])
                ->name('socios.bloquear.show');

            Route::post('/{socio}/bloquear', [BloqueoSocioController::class, 'execute'])
                ->name('socios.bloquear');

            Route::patch('/{socio}/desbloquear', [BloqueoSocioController::class, 'desbloquear'])
                ->name('socios.desbloquear');

            Route::get('/{socio}/editar', [SocioController::class, 'edit'])
                ->name('socios.edit');

            Route::match(['put', 'patch'], '/{socio}', [SocioController::class, 'update'])
                ->name('socios.update');
        });

        Route::prefix('usuarios')->group(function () {

            Route::get('/create', [UserController::class, 'create'])
                ->name('users.create');

            Route::post('/', [UserController::class, 'store'])
                ->name('users.store');
        });
    });


    /* ─────────────────────────────
    | 🔹 SOCIO
    └─────────────────────────────*/
    Route::middleware(['role:socio'])->group(function () {

        Route::get('/socio/panel', function () {
            $user = Auth::user();

            // OPTIMIZACIÓN: evitar query extra innecesaria si ya viene cargado
            $socio = Socio::with('membresiaActiva')
                ->where('user_id', $user->id)
                ->first();

            return Inertia::render('Accesos/Socios/Panel', [
                'user'      => $user,
                'socio'     => $socio,
                'membresia' => $socio?->membresiaActiva,
            ]);
        })->name('socio.panel');
    });


    /* ─────────────────────────────
    | 🔹 PERFIL
    └─────────────────────────────*/
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

});

require __DIR__.'/auth.php';