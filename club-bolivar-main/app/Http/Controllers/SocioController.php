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
            'socios' => $query->get(),
            'filtroEstado' => $estado,
        ]);
    }

    /* ─────────────────────────────
     * STORE
     * ───────────────────────────── */
    public function store(Request $request)
    {
        $request->validate([
            'nombres'   => 'required|string',
            'apellidos' => 'required|string',
            'ci'        => ['required', 'digits:8', 'unique:socios,ci'],
            'telefono'  => ['required', 'digits:8', 'regex:/^[67][0-9]{7}$/'],
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|min:6|confirmed',
            'foto'      => 'required|string',
        ]);

        $roleId = Role::where('nombre', 'socio')->value('id');

        if (!$roleId) {
            return response()->json(['error' => "Rol 'socio' no existe"], 500);
        }

        // guardar foto
        $fotoPath = $this->uploadBase64($request->foto);
        $absolutePath = storage_path('app/public/' . $fotoPath);

        try {

            DB::transaction(function () use ($request, $fotoPath, $roleId, $absolutePath) {

                $user = User::create([
                    'id' => (string) Str::uuid(),
                    'name' => $request->nombres . ' ' . $request->apellidos,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role_id' => $roleId,
                    'activo' => true,
                ]);

                $socio = Socio::create([
                    'id' => (string) Str::uuid(),
                    'numero_socio' => 'SOC-' . strtoupper(Str::random(6)),
                    'nombres' => $request->nombres,
                    'apellidos' => $request->apellidos,
                    'ci' => $request->ci,
                    'fecha_nacimiento' => $request->fecha_nacimiento,
                    'telefono' => $request->telefono,
                    'direccion' => $request->direccion,
                    'estado' => 'activo',
                    'estado_aprobacion' => 'Aprobado',
                    'fecha_ingreso' => now(),
                    'foto_path' => $fotoPath,
                    'activo' => 1,
                    'deleted' => 0,
                    'email' => $request->email,
                    'user_id' => $user->id,
                    'qr_token' => (string) Str::uuid(),
                ]);

                // embeddings (seguro, no rompe transacción)
                $this->guardarEmbeddings($socio->id, $absolutePath, 'frontal');

                Membresia::create([
                    'id' => (string) Str::uuid(),
                    'socio_id' => $socio->id,
                    'tipo' => $request->tipo_membresia,
                    'fecha_inicio' => now()->toDateString(),
                    'fecha_fin' => now()->addMonth()->toDateString(),
                    'estado' => 'activo',
                    'deleted' => false,
                ]);
            });

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error creando socio',
                'detalle' => $e->getMessage()
            ], 500);
        }

        return redirect()->route('socios.index');
    }

    /* ─────────────────────────────
     * UPDATE
     * ───────────────────────────── */
    public function update(Request $request, Socio $socio)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'ci' => 'required|unique:socios,ci,' . $socio->id,
            'email' => 'nullable|email',
            'estado' => 'required',
            'foto' => 'nullable',
        ]);

        $fotoPath = $socio->foto_path;

        if ($request->filled('foto') && str_contains($request->foto, 'data:image')) {

            if ($socio->foto_path) {
                Storage::disk('public')->delete($socio->foto_path);
            }

            $fotoPath = $this->uploadBase64($request->foto);
            $validated['foto_path'] = $fotoPath;
        }

        if ($request->hasFile('foto')) {

            if ($socio->foto_path) {
                Storage::disk('public')->delete($socio->foto_path);
            }

            $fotoPath = $request->file('foto')->store('fotos_socios', 'public');
            $validated['foto_path'] = $fotoPath;
        }

        unset($validated['foto']);

        if (isset($validated['foto_path'])) {
            $absolutePath = storage_path('app/public/' . $fotoPath);

            \App\Models\SocioEmbedding::where('socio_id', $socio->id)->delete();

            $this->guardarEmbeddings($socio->id, $absolutePath, 'frontal');

            unset($validated['embedding'], $validated['embedding_updated_at'], $validated['sync_version']);
        }

        $socio->update($validated);

        if ($request->filled('membresia_plan')) {

            $membresia = $socio->membresiaActiva;

            if ($membresia) {
                $membresia->update(['tipo' => $request->membresia_plan]);
            } else {
                Membresia::create([
                    'id' => (string) Str::uuid(),
                    'socio_id' => $socio->id,
                    'tipo' => $request->membresia_plan,
                    'fecha_inicio' => now()->toDateString(),
                    'fecha_fin' => now()->addMonth()->toDateString(),
                    'estado' => 'activo',
                    'deleted' => false,
                ]);
            }
        }

        return redirect()->route('socios.index')
            ->with('success', 'Socio actualizado correctamente.');
    }

    /* ─────────────────────────────
     * EMBEDDING
     * ───────────────────────────── */
    private function generateEmbedding(string $absolutePath, string $etiqueta = 'frontal'): ?array
    {
        try {
            $response = Http::attach(
                'file',
                file_get_contents($absolutePath),
                basename($absolutePath)
            )->post(env('FACIAL_API_URL') . '/embedding', [
                'etiqueta' => $etiqueta
            ]);

            if (!$response->successful()) return null;

            $embedding = $response->json('embedding');
            $confianza = $response->json('confianza', 0);

            if (!$embedding || !is_array($embedding)) return null;

            return [
                'vector' => '[' . implode(',', $embedding) . ']',
                'confianza' => $confianza,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    private function guardarEmbeddings(string $socioId, string $absolutePath, string $etiqueta = 'frontal'): void
    {
        $resultado = $this->generateEmbedding($absolutePath, $etiqueta);

        if (!$resultado) return;

        \App\Models\SocioEmbedding::create([
            'id' => (string) Str::uuid(),
            'socio_id' => $socioId,
            'embedding' => $resultado['vector'],
            'etiqueta' => $etiqueta,
            'confianza' => $resultado['confianza'],
            'created_at' => now(),
        ]);

        \App\Models\Socio::where('id', $socioId)->update([
            'embedding' => $resultado['vector'],
            'embedding_updated_at' => now(),
            'sync_version' => DB::raw('sync_version + 1'),
        ]);
    }

    private function uploadBase64(string $base64String): string
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

    public function edit(Socio $socio)
    {
        return Inertia::render('Accesos/Socios/SociosEdit', [
            'socio' => $socio->load('membresiaActiva'),
        ]);
    }

    public function agregarEmbedding(Request $request, Socio $socio)
    {
        $request->validate([
            'foto' => 'required|string',
            'etiqueta' => 'required|in:frontal,lentes,lateral,oscuro,otro',
        ]);

        $fotoPath = $this->uploadBase64($request->foto);
        $absolutePath = storage_path('app/public/' . $fotoPath);

        $this->guardarEmbeddings($socio->id, $absolutePath, $request->etiqueta);

        Storage::disk('public')->delete($fotoPath);

        return response()->json([
            'ok' => true,
            'mensaje' => "Embedding '{$request->etiqueta}' agregado correctamente",
            'total' => \App\Models\SocioEmbedding::where('socio_id', $socio->id)->count(),
        ]);
    }
}