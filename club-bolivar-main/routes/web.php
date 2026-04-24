<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReconocimientoController;
use App\Http\Controllers\SocioController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Socio;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- PÁGINA DE INICIO (PÚBLICA) ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('home');

// --- RUTAS PROTEGIDAS (REQUIEREN LOGIN) ---
Route::middleware(['auth'])->group(function () {
    
    // Dashboard Principal
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // --- MÓDULO DE ACCESOS Y BIOMETRÍA ---
    Route::prefix('accesos')->group(function () {
        
        // 1. Reconocimiento Facial (Vista)
        Route::get('/reconocimiento', function () {
            return Inertia::render('Accesos/ReconocimientoFacial');
        })->name('reconocimiento.index');

        // 2. Registro de Socios con Foto (Vista)
        // Esta es la ruta que debes usar en el Dashboard: route('socios.create')
        Route::get('/registrar-socio', function () {
            return Inertia::render('Accesos/Socios/RegistrarSocio');
        })->name('socios.create');

        // --- ACCIONES POST ---
        
        // Procesar verificación de IA
        Route::post('/reconocer', [ReconocimientoController::class, 'verificar'])
            ->name('accesos.reconocer');

        // Guardar nuevo socio en la BD
        Route::post('/guardar-socio', [SocioController::class, 'store'])
            ->name('socios.store');
    });

    // --- GESTIÓN DE PERFIL DE USUARIO ---
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    Route::resource('socios', SocioController::class);
    Route::get('/socios', [SocioController::class, 'index'])->name('socios.index');
    Route::delete('/socios/{socio}', [SocioController::class, 'destroy'])
    ->name('socios.destroy');
    Route::patch('/socios/{socio}/restore', [SocioController::class, 'restore'])
    ->name('socios.restore');
    
    Route::get('/socio/panel', function () {

        $user = Auth::user();

        $socio = Socio::where('user_id', $user->id)->first();

        return Inertia::render('Accesos/Socios/Panel', [
            'user' => $user,
            'socio' => $socio
        ]);

    })->middleware(['auth'])->name('socio.panel');    
});

require __DIR__.'/auth.php';