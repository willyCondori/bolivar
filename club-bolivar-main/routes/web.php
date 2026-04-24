<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReconocimientoController;
use App\Http\Controllers\SocioController; 
use App\Http\Controllers\ReporteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Socio;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- PÚBLICO ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('home');


// --- PROTEGIDO ---
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');


    // ===============================
    // 🔹 ACCESOS
    // ===============================
    Route::prefix('accesos')->group(function () {

        Route::get('/reconocimiento', fn() =>
            Inertia::render('Accesos/ReconocimientoFacial')
        )->name('reconocimiento.index');

        Route::post('/reconocer', [ReconocimientoController::class, 'verificar'])
            ->name('accesos.reconocer');
    });


    // ===============================
    // 🔹 SOCIOS
    // ===============================
    Route::prefix('socios')->group(function () {

        Route::get('/registrar', fn() =>
            Inertia::render('Accesos/Socios/RegistrarSocio')
        )->name('socios.create');

        Route::post('/guardar', [SocioController::class, 'store'])
            ->name('socios.store');

        Route::get('/', [SocioController::class, 'index'])->name('socios.index');
        Route::delete('/{socio}', [SocioController::class, 'destroy'])->name('socios.destroy');
        Route::patch('/{socio}/restore', [SocioController::class, 'restore'])->name('socios.restore');
    });


    // ===============================
    // 🔹 PANEL SOCIO
    // ===============================
    Route::get('/socio/panel', function () {

        $user = Auth::user();

        $socio = Socio::where('user_id', $user->id)->first();

        return Inertia::render('Accesos/Socios/Panel', [
            'user' => $user,
            'socio' => $socio
        ]);

    })->name('socio.panel');


    // ===============================
    // 🔹 REPORTES (VISTA)
    // ===============================
    Route::get('/reportes/ingresos', fn() =>
        Inertia::render('Accesos/Reportes/ReporteIngresos')
    )->name('reportes.ingresos');


    // ===============================
    // 🔹 PERFIL
    // ===============================
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

});

require __DIR__.'/auth.php';