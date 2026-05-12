<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Socio;
use App\Models\Membresia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SocioController extends Controller
{
    public function index(Request $request)
    {
        $estado = $request->get('estado', 'Activo');

        $query = Socio::with('membresiaActiva');

        if ($estado === 'activo') {
            $query->where('estado', 'activo')->where('deleted', 0);
        } elseif ($estado === 'inactivo') {
            $query->where('estado', 'inactivo');
        } elseif ($estado === 'bloqueado') {
            $query->where('estado', 'bloqueado');
        } elseif ($estado === 'Todos') {
            $query->where('deleted', 0);
        }

        return Inertia::render('Accesos/Socios/VerSocios', [
            'socios'      => $query->get(),
            'filtroEstado' => $estado,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombres'        => 'required|string',
            'apellidos'      => 'required|string',
            'ci'             => ['required', 'digits:8', 'unique:socios,ci'],
            'telefono'       => ['required', 'digits:8', 'regex:/^[67][0-9]{7}$/'],
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|min:6|confirmed',
            'foto'           => 'required|string',
        ]);

        $roleId = Role::where('nombre', 'socio')->value('id');

        if (!$roleId) {
            return response()->json(['error' => "Rol 'socio' no existe"], 500);
        }

        // Subir foto ANTES de la transacción (operación I/O fuera de TX)
        $fotoPath = $this->uploadBase64($request->foto);

        $socio = null; // ← para usarlo fuera de la transacción

        DB::transaction(function () use ($request, $fotoPath, $roleId, &$socio) {

            $user = User::create([
                'id'       => (string) Str::uuid(),
                'name'     => $request->nombres . ' ' . $request->apellidos,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role_id'  => $roleId,
                'activo'   => true,
            ]);

            $socio = Socio::create([
                'id'                  => (string) Str::uuid(),
                'numero_socio'        => 'SOC-' . strtoupper(Str::random(6)),
                'nombres'             => $request->nombres,
                'apellidos'           => $request->apellidos,
                'ci'                  => $request->ci,
                'fecha_nacimiento'    => $request->fecha_nacimiento,
                'telefono'            => $request->telefono,
                'direccion'           => $request->direccion,
                'estado'              => 'activo',
                'estado_aprobacion'   => 'Aprobado',
                'fecha_ingreso'       => now(),
                'foto_path'           => $fotoPath,
                'activo'              => 1,
                'deleted'             => 0,
                'email'               => $request->email,
                'user_id'             => $user->id,
                'qr_token'            => (string) Str::uuid(),
                'tipo_membresia'      => 'Bronce',
            ]);

            Membresia::create([
                'id'           => (string) Str::uuid(),
                'socio_id'     => $socio->id,
                'tipo'         => $request->tipo_membresia,
                'fecha_inicio' => now()->toDateString(),
                'fecha_fin'    => now()->addMonth()->toDateString(),
                'estado'       => 'activo',
                'deleted'      => false,
            ]);
        });

        return redirect()->route('socios.index');
    }

    public function edit(Socio $socio)
    {
        $socio->load('membresiaActiva');

        return Inertia::render('Accesos/Socios/SociosEdit', [
            'socio' => $socio,
        ]);
    }

    public function update(Request $request, Socio $socio)
    {
        $validated = $request->validate([
            'nombres'        => 'required|string|max:255',
            'apellidos'      => 'required|string|max:255',
            'ci'             => 'required|unique:socios,ci,' . $socio->id,
            'email'          => 'nullable|email',
            'estado'         => 'required',
            'foto'           => 'nullable',
            'tipo_membresia' => 'nullable|in:Bronce,Plata,Oro',
        ]);

        $fotoActualizada = null;

        // ✅ CASO 1: foto en base64 (viene del webcam/cropper)
        if ($request->filled('foto') && str_contains($request->foto, 'data:image')) {

            if ($socio->foto_path) {
                Storage::disk('public')->delete($socio->foto_path);
            }

            $fotoActualizada = $this->uploadBase64($request->foto);
            $validated['foto_path'] = $fotoActualizada;
        }

        // ✅ CASO 2: foto como archivo normal (file input)
        if ($request->hasFile('foto')) {

            if ($socio->foto_path) {
                Storage::disk('public')->delete($socio->foto_path);
            }

            $fotoActualizada = $request->file('foto')->store('fotos_socios', 'public');
            $validated['foto_path'] = $fotoActualizada;
        }

        // Remover 'foto' del array validado (no es columna de DB)
        unset($validated['foto']);

        $socio->update($validated);

        // ✅ Membresía: solo si se envía explícitamente un plan nuevo
        if ($request->filled('membresia_plan')) {

            $membresia = $socio->membresiaActiva;

            if ($membresia) {
                $membresia->update(['tipo' => $request->membresia_plan]);
            } else {
                Membresia::create([
                    'id'           => (string) Str::uuid(),
                    'socio_id'     => $socio->id,
                    'tipo'         => $request->membresia_plan,
                    'fecha_inicio' => now()->toDateString(),
                    'fecha_fin'    => now()->addMonth()->toDateString(),
                    'estado'       => 'activo',
                    'deleted'      => false,
                ]);
            }
        }

        return redirect()->route('socios.index')
            ->with('success', 'Socio actualizado correctamente.');
    }

    public function destroy(Socio $socio)
    {
        DB::transaction(function () use ($socio) {

            $socio->update([
                'deleted' => 1,
                'estado'  => 'inactivo',
                'activo'  => 0,
            ]);

            $socio->membresias()
                ->where('estado', 'activo')
                ->update(['estado' => 'inactivo']);
        });

        return redirect()->route('socios.index');
    }

    public function restore(Socio $socio)
    {
        DB::transaction(function () use ($socio) {

            $socio->update([
                'deleted' => 0,
                'estado'  => 'activo',
                'activo'  => 1,
            ]);

            $tieneActiva = $socio->membresias()
                ->where('estado', 'activo')
                ->exists();

            if (!$tieneActiva) {
                Membresia::create([
                    'id'           => (string) Str::uuid(),
                    'socio_id'     => $socio->id,
                    'tipo'         => 'Celeste',
                    'fecha_inicio' => now()->toDateString(),
                    'fecha_fin'    => now()->addMonth()->toDateString(),
                    'estado'       => 'activo',
                    'deleted'      => false,
                ]);
            }
        });

        return redirect()->route('socios.index');
    }

    /* ── HELPERS ─────────────────────────────────────────── */

    private function uploadBase64(string $base64String): string
    {
        $img      = preg_replace('/^data:image\/\w+;base64,/', '', $base64String);
        $img      = str_replace(' ', '+', $img);
        $fileName = 'socio_' . time() . '_' . Str::random(5) . '.jpg';

        Storage::disk('public')->put('fotos_socios/' . $fileName, base64_decode($img));

        return 'fotos_socios/' . $fileName;
    }

}