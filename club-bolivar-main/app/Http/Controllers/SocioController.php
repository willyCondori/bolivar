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

class SocioController extends Controller
{
    public function index(Request $request)
    {
        $estado = $request->get('estado', 'Activo');

        $query = Socio::with('membresiaActiva');

        if ($estado === 'Activo') {
            $query->where('estado', 'Activo')
                ->where('deleted', 0);
        }

        if ($estado === 'Inactivo') {
            $query->where('estado', 'Inactivo');
        }

        if ($estado === 'Bloqueado') {
            $query->where('estado', 'Bloqueado');
        }

        if ($estado === 'Todos') {
            $query->where('deleted', 0);
        }
        
        return Inertia::render('Accesos/Socios/VerSocios', [
            'socios' => $query->get(),
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
            'tipo_membresia' => 'required|in:Celeste,Dorado,Platino',
            'foto'           => 'required|string',
        ]);

        $roleId = Role::where('nombre', 'socio')->value('id');

        if (!$roleId) {
            return response()->json(['error' => "Rol 'socio' no existe"], 500);
        }

        // 🔥 mover fuera de transacción (IMPORTANTE)
        $fotoPath = $this->uploadBase64($request->foto);

        DB::transaction(function () use ($request, $fotoPath, $roleId) {

            $user = User::create([
                'id'       => (string) Str::uuid(),
                'name'     => $request->nombres . ' ' . $request->apellidos,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role_id'  => $roleId,
                'activo'   => true,
            ]);

            $socio = Socio::create([
                'id'               => (string) Str::uuid(),
                'numero_socio'    => 'SOC-' . strtoupper(Str::random(6)),
                'nombres'         => $request->nombres,
                'apellidos'       => $request->apellidos,
                'ci'              => $request->ci,
                'fecha_nacimiento'=> $request->fecha_nacimiento,
                'telefono'        => $request->telefono,
                'direccion'       => $request->direccion,
                'estado'          => 'Activo',
                'estado_aprobacion' => 'En espera',
                'fecha_ingreso'   => now(),
                'foto_path'       => $fotoPath,
                'activo'          => 1,
                'deleted'         => 0,
                'email'           => $request->email,
                'user_id'         => $user->id,
                'qr_token'        => (string) Str::uuid(),
                'tipo_membresia'   => 'Bronce',

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
            'nombres'   => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'ci'        => 'required|unique:socios,ci,' . $socio->id,
            'email'     => 'nullable|email',
            'estado'    => 'required',
            'foto'      => 'nullable',
            'tipo_membresia' => 'nullable|in:Bronce,Plata,Oro', // 👈 SOLO SOCIO
        ]);

        /* ── FOTO ───────────────────────────── */
        if ($request->filled('foto') && str_contains($request->foto, 'data:image')) {

            if ($socio->foto_path) {
                Storage::disk('public')->delete($socio->foto_path);
            }

            $validated['foto_path'] = $this->uploadBase64($request->foto);
        }

        /* ── ACTUALIZAR SOCIO ───────────────── */
        $socio->update($validated);

        /* ───────────────────────────────────────
        🔥 IMPORTANTE: MEMBRESIA NO USA BRONCE/PLATA/ORO
        SOLO SE ACTUALIZA SI EXISTE CAMBIO REAL DE PLAN
        ─────────────────────────────────────── */
        if ($request->filled('membresia_plan')) {

            $membresia = $socio->membresiaActiva;

            if ($membresia) {

                // ⚠️ aquí YA NO usamos tipo_membresia
                $membresia->update([
                    'tipo' => $membresia->tipo // se mantiene igual
                ]);

            } else {

                Membresia::create([
                    'id'           => (string) Str::uuid(),
                    'socio_id'     => $socio->id,

                    // ✔ valor seguro por defecto del sistema membresias
                    'tipo'         => 'Celeste',

                    'fecha_inicio' => now()->toDateString(),
                    'fecha_fin'    => now()->addMonth()->toDateString(),
                    'estado'       => 'activo',
                    'deleted'      => false,
                ]);
            }
        }

        /* ── FOTO FILE NORMAL ───────────────── */
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('socios', 'public');
            $socio->foto_path = $path;
            $socio->save();
        }

        return redirect()->route('socios.index')
            ->with('success', 'Socio actualizado correctamente.');
    }
    public function destroy(Socio $socio)
    {
        DB::transaction(function () use ($socio) {

            $socio->update([
                'deleted' => 1,
                'estado'  => 'Inactivo',
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
                'estado'  => 'Activo',
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

    /* ── HELPERS ───────────────────────────── */

    private function uploadBase64($base64String)
    {
        $img = preg_replace('/^data:image\/\w+;base64,/', '', $base64String);
        $img = str_replace(' ', '+', $img);

        $fileName = 'socio_' . time() . '_' . Str::random(5) . '.jpg';

        Storage::disk('public')->put(
            'fotos_socios/' . $fileName,
            base64_decode($img)
        );

        return 'fotos_socios/' . $fileName;
    }
}