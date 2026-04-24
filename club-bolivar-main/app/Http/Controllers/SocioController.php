<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Socio;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SocioController extends Controller
{
    public function index(Request $request)
    {
        $estado = $request->get('estado', 'Activo'); 
        // por defecto muestra activos

        $query = Socio::query();

        if ($estado === 'Activo') {
            $query->where('deleted', 0)->where('estado', 'Activo');
        }

        if ($estado === 'Inactivo') {
            $query->where('estado', 'Inactivo');
        }

        if ($estado === 'Todos') {
            // opcional: muestra todo
            $query->where('deleted', 0);
        }

        $socios = $query->get();

        return Inertia::render('Accesos/Socios/VerSocios', [
            'socios' => $socios,
            'filtroEstado' => $estado
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombres' => 'required|string',
            'apellidos' => 'required|string',
            'ci' => [
                'required',
                'digits:8',
                'unique:socios,ci'
            ],

            'telefono' => [
                'required',
                'digits:8',
                'regex:/^[67][0-9]{7}$/'
            ],

            'email' => 'nullable|email|unique:socios,email',
            'tipo_membresia' => 'required',
            'foto' => 'required', 
        ]);

        $fotoPath = null;
        if ($request->foto) {
            $fotoPath = $this->uploadBase64($request->foto);
        }

        Socio::create([
            'id' => (string) Str::uuid(),
            'numero_socio' => 'SOC-' . strtoupper(Str::random(6)),
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'ci' => $request->ci,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'tipo_membresia' => $request->tipo_membresia,
            'estado' => 'Activo', 
            'estado_aprobacion' => 'En espera',
            'fecha_ingreso' => now(),
            'foto_path' => $fotoPath,
            'activo' => 1,
            'deleted' => 0,
            'email' => $request->email,
            'user_id' => $user->id,
        ]);

        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $request->nombres . ' ' . $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->ci), // o password temporal
            'role_id' => $this->getRoleId('socio'),
            'activo' => true,
        ]);

        return redirect()->route('socios.index');
    }

    public function edit(Socio $socio)
    {
        return Inertia::render('Accesos/Socios/SociosEdit', [
            'socio' => $socio
        ]);
    }

    public function update(Request $request, Socio $socio)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'ci' => 'required|unique:socios,ci,' . $socio->id,
            'email' => 'nullable|email',
            'tipo_membresia' => 'required',
            'estado' => 'required',
            'foto' => 'nullable' // Por si quieres actualizar la foto facial
        ]);

        // Si se envía una nueva foto en Base64
        if ($request->filled('foto') && str_contains($request->foto, 'data:image')) {
            // Borrar foto anterior si existe
            if ($socio->foto_path) {
                Storage::disk('public')->delete($socio->foto_path);
            }
            $validated['foto_path'] = $this->uploadBase64($request->foto);
        }

        $socio->update($validated);

        return redirect()->route('socios.index')->with('success', 'Socio actualizado correctamente.');
    }

    /**
     * Función auxiliar para procesar Base64
     */
    private function uploadBase64($base64String)
    {
        $img = str_replace('data:image/jpeg;base64,', '', $base64String);
        $img = str_replace(' ', '+', $img);
        $fileName = 'socio_' . time() . '_' . Str::random(5) . '.jpg';
        Storage::disk('public')->put('fotos_socios/' . $fileName, base64_decode($img));
        return 'fotos_socios/' . $fileName;
    }

    public function destroy(Socio $socio)
    {
        $socio->update([
            'deleted' => 1,
            'estado' => 'Inactivo',
            'activo' => 0
        ]);

        return redirect()->route('socios.index')
            ->with('success', 'Socio desactivado correctamente.');
    }

    public function restore(Socio $socio)
    {
        $socio->update([
            'deleted' => 0,
            'estado' => 'Activo',
            'activo' => 1
        ]);

        return redirect()->route('socios.index')
            ->with('success', 'Socio reactivado correctamente.');
    }
    private function getRoleId($nombre)
    {
        return \App\Models\Role::where('nombre', $nombre)->value('id');
    }
}