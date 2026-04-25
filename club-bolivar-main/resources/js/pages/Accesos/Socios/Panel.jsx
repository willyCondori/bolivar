import React, { useState, useRef, useCallback } from 'react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useForm } from '@inertiajs/react';
import Webcam from 'react-webcam';

// ── constantes ────────────────────────────────────────────────────────────────
const hoy = new Date();
const dateLimit = (y) => new Date(hoy.getFullYear() - y, hoy.getMonth(), hoy.getDate()).toISOString().split('T')[0];

const MEMBRESIAS = {
    Celeste: { desc:'Acceso estándar a instalaciones comunes.', color:'#00BFFF', icon:'🔵' },
    Dorado:  { desc:'Acceso intermedio con beneficios extra.',  color:'#FFD700', icon:'🥇' },
    Platino: { desc:'Acceso VIP y áreas exclusivas premium.',   color:'#E5E4E2', icon:'💎' },
};

// ── helpers ───────────────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
    <div className="form-group">
        <label className="label-style">{label}</label>
        {children}
        {error && <span className="err">{error}</span>}
    </div>
);

// ── component ─────────────────────────────────────────────────────────────────
export default function RegistrarSocio() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        nombres:'', apellidos:'', ci:'', email:'',
        password:'', password_confirmation:'',
        fecha_nacimiento:'', telefono:'', direccion:'',
        foto: null, tipo_membresia:'Platino',
    });

    const validatePassword = (val) => {
        const ok = /^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(val);
        val.length > 0
            ? ok ? clearErrors('password') : setError('password', 'Entre 8-15 caracteres (una mayúscula y una minúscula).')
            : clearErrors('password');
    };

    const capture = useCallback(() => {
        const src = webcamRef.current.getScreenshot();
        setImgSrc(src); setData('foto', src);
    }, [webcamRef, setData]);

    const submit = (e) => {
        e.preventDefault();
        if (data.password !== data.password_confirmation)
            return setError('password_confirmation', 'Las contraseñas no coinciden.');

        const d = new Date(data.fecha_nacimiento);
        if (!data.fecha_nacimiento) return setError('fecha_nacimiento', 'La fecha de nacimiento es obligatoria.');
        let age = hoy.getFullYear() - d.getFullYear();
        if (hoy.getMonth() < d.getMonth() || (hoy.getMonth() === d.getMonth() && hoy.getDate() < d.getDate())) age--;
        if (age < 18 || age > 90) return setError('fecha_nacimiento', `Edad no permitida: ${age} años (18-90).`);

        post(route('socios.store'));
    };

    const mem = MEMBRESIAS[data.tipo_membresia] ?? MEMBRESIAS.Platino;

    return (
        <AppSidebarLayout title="Nuevo Socio">
            <div className="max-w-5xl mx-auto p-4">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">Inscripción de <span>Socio</span></h1>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Campos del formulario */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Nombres"    error={errors.nombres}>
                                    <input type="text" value={data.nombres} className="input-style" onChange={e => setData('nombres', e.target.value)} />
                                </Field>
                                <Field label="Apellidos"  error={errors.apellidos}>
                                    <input type="text" value={data.apellidos} className="input-style" onChange={e => setData('apellidos', e.target.value)} />
                                </Field>
                                <Field label="CI"         error={errors.ci}>
                                    <input type="text" value={data.ci} className="input-style" maxLength={8} onChange={e => setData('ci', e.target.value.replace(/\D/g, ''))} />
                                </Field>
                                <Field label="Email">
                                    <input type="email" value={data.email} className="input-style" onChange={e => setData('email', e.target.value)} />
                                </Field>
                                <Field label="Contraseña (Máx 15)" error={errors.password}>
                                    <input type="password" value={data.password} maxLength={15}
                                        className={`input-style ${errors.password ? 'border-red-500/50' : ''}`}
                                        onChange={e => { setData('password', e.target.value); validatePassword(e.target.value); }} />
                                </Field>
                                <Field label="Confirmar Contraseña" error={errors.password_confirmation}>
                                    <input type="password" value={data.password_confirmation} maxLength={15}
                                        className={`input-style ${errors.password_confirmation ? 'border-red-500/50' : ''}`}
                                        onChange={e => setData('password_confirmation', e.target.value)} />
                                </Field>
                                <Field label="Fecha Nacimiento (18-90 años)" error={errors.fecha_nacimiento}>
                                    <input type="date" value={data.fecha_nacimiento} min={dateLimit(90)} max={dateLimit(18)}
                                        className={`input-style ${errors.fecha_nacimiento ? 'border-red-500' : ''}`}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const year = new Date(val).getFullYear();
                                            if (year > new Date(dateLimit(18)).getFullYear()) {
                                                setData('fecha_nacimiento', dateLimit(18));
                                                setError('fecha_nacimiento', 'El año no es válido.');
                                            } else {
                                                setData('fecha_nacimiento', val);
                                                clearErrors('fecha_nacimiento');
                                            }
                                        }} />
                                </Field>
                                <Field label="Teléfono">
                                    <input type="text" value={data.telefono} maxLength={8} className="input-style"
                                        onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))} />
                                </Field>

                                {/* Membresía */}
                                <div className="md:col-span-2 mt-4">
                                    <div className="membresia-sep"><span>Plan de Membresía</span></div>
                                    <div className="membresia-cards mt-4">
                                        {Object.entries(MEMBRESIAS).map(([key, info]) => (
                                            <button key={key} type="button"
                                                className={`mem-card ${data.tipo_membresia === key ? 'mem-card--active' : ''}`}
                                                style={data.tipo_membresia === key ? { borderColor: info.color } : {}}
                                                onClick={() => setData('tipo_membresia', key)}>
                                                <span className="mem-icon">{info.icon}</span>
                                                <span className="mem-label" style={data.tipo_membresia === key ? { color: info.color } : {}}>{key}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mem-desc" style={{ borderColor: mem.color + '44' }}>{mem.desc}</div>
                                </div>
                            </div>

                            {/* Webcam */}
                            <div className="flex flex-col items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                <label className="label-style mb-4 text-center">Foto Reconocimiento</label>
                                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black">
                                    {!imgSrc
                                        ? <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                                        : <img src={imgSrc} className="w-full h-full object-cover" alt="Captura" />}
                                </div>
                                <button type="button" onClick={imgSrc ? () => { setImgSrc(null); setData('foto', null); } : capture}
                                    className={`mt-4 w-full py-2 rounded-xl font-bold transition-all ${imgSrc ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500 text-slate-900'}`}>
                                    {imgSrc ? 'Repetir Foto' : 'Tomar Captura'}
                                </button>
                                {errors.foto && <span className="err mt-2">{errors.foto}</span>}
                            </div>
                        </div>

                        <button type="submit" disabled={processing || !imgSrc || errors.password || errors.fecha_nacimiento}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-black uppercase text-white shadow-xl disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Confirmar Registro'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .label-style { display:block; color:#1CE0EB; font-size:.75rem; font-weight:800; text-transform:uppercase; margin-bottom:.5rem; }
                .input-style { width:100%; background:rgba(0,0,0,.4); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:.8rem; color:white; outline:none; }
                .input-style:focus { border-color:#1CE0EB; }
                .err { color:#f87171; font-size:.75rem; margin-top:.25rem; display:block; }
                .membresia-sep { border-top:1px solid rgba(255,255,255,.1); padding-top:1rem; color:#1CE0EB; font-weight:800; }
                .membresia-cards { display:flex; gap:.75rem; }
                .mem-card { flex:1; display:flex; flex-direction:column; align-items:center; padding:.85rem; border-radius:16px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); cursor:pointer; }
                .mem-card--active { background:rgba(0,0,0,.4); }
                .mem-icon { font-size:1.5rem; }
                .mem-label { font-size:.7rem; font-weight:800; margin-top:.3rem; text-transform:uppercase; }
                .mem-desc { margin-top:1rem; padding:.75rem; border-radius:12px; border:1px solid; background:rgba(255,255,255,.03); color:rgba(255,255,255,.6); font-size:.8rem; }
            `}</style>
        </AppSidebarLayout>
    );
}