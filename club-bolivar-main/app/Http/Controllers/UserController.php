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
        $roles = Role::whereIn('nombre', ['admin', 'operador'])
            ->select('id', 'nombre')
            ->get();

        return Inertia::render('Accesos/Usuarios/CrearUsuario', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'role_id'  => 'required|exists:roles,id',
        ]);

        $role = Role::select('id', 'nombre')
            ->find($request->role_id);

        if (!$role || !in_array($role->nombre, ['admin', 'operador'])) {
            return back()->withErrors([
                'role_id' => 'Rol no permitido'
            ]);
        }

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'role_id'  => $role->id,
            'password' => Hash::make($request->password),
            'activo'   => true,
        ]);

        return back()->with([
            'success' => 'Usuario creado correctamente'
        ]);
    }
}