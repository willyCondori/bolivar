<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function create()
    {
        $roles = Role::whereIn('nombre', ['admin', 'operador'])->get();

        return Inertia::render('Usuarios/CrearUsuario', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::find($request->role_id);

        // 🔒 SEGURIDAD: solo Admin u Operador
        if (!in_array($role->nombre, ['Admin', 'Operador'])) {
            return back()->withErrors([
                'role_id' => 'Rol no permitido'
            ]);
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
            'activo' => true,
        ]);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado correctamente');
    }
}