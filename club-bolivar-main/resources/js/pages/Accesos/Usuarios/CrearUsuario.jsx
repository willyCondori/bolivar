import React from 'react';
import { useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

export default function CrearUsuario({ roles }) {

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
    });

    const validate = () => {
        let valid = true;

        clearErrors();

        // EMAIL VALIDATION
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setError('email', 'Email inválido');
            valid = false;
        }

        // PASSWORD VALIDATION
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

        if (!passwordRegex.test(data.password)) {
            setError(
                'password',
                'La contraseña debe tener 8-16 caracteres, una mayúscula y una minúscula'
            );
            valid = false;
        }

        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Las contraseñas no coinciden');
            valid = false;
        }

        return valid;
    };

    const submit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        post(route('users.store'));
    };

    return (
        <AppSidebarLayout title="Crear Usuario">

            <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-2xl border border-white/10">

                <h1 className="text-xl font-bold text-cyan-400 mb-6">
                    Registrar Personal
                </h1>

                <form onSubmit={submit} className="space-y-4">

                    {/* NAME */}
                    <div>
                        <label>Nombre</label>
                        <input
                            className="input-style"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-400">{errors.name}</p>}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-style"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-400">{errors.email}</p>}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            className="input-style"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <p className="text-red-400">{errors.password}</p>}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label>Confirmar contraseña</label>
                        <input
                            type="password"
                            className="input-style"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-400">{errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* ROLE */}
                    <div>
                        <label>Rol</label>
                        <select
                            className="input-style"
                            value={data.role_id}
                            onChange={e => setData('role_id', e.target.value)}
                        >
                            <option value="">Seleccionar rol</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.nombre}
                                </option>
                            ))}
                        </select>

                        {errors.role_id && <p className="text-red-400">{errors.role_id}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-cyan-500 text-black font-bold py-2 rounded-xl"
                    >
                        Crear Usuario
                    </button>

                </form>
            </div>

            <style>{`
                .input-style{
                    width:100%;
                    padding:10px;
                    border-radius:10px;
                    background:rgba(0,0,0,0.3);
                    border:1px solid rgba(255,255,255,0.1);
                    color:white;
                }
                label{color:#1CE0EB;font-size:12px;font-weight:700}
            `}</style>

        </AppSidebarLayout>
    );
}