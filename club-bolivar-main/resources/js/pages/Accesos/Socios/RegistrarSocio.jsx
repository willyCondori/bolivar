import React, { useState, useRef, useCallback } from 'react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useForm } from '@inertiajs/react';
import Webcam from 'react-webcam';

export default function RegistrarSocio() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    // --- LÓGICA DE FECHAS PARA VALIDACIÓN DE EDAD ---
    const hoy = new Date();
    // Fecha máxima permitida (hace 18 años): No pueden ser menores de 18
    const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0]; 
    // Fecha mínima permitida (hace 90 años): No pueden ser mayores de 90
    const fechaMin = new Date(hoy.getFullYear() - 90, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0];

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        nombres: '',
        apellidos: '',
        ci: '',
        email: '',
        password: '',
        password_confirmation: '',
        fecha_nacimiento: '',
        telefono: '',
        direccion: '',
        foto: null,
        tipo_membresia: 'Platino',
    });

    const validatePassword = (pass) => {
        // Regex: Entre 8 y 15 caracteres, requiere Mayúscula y Minúscula
        const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
        
        if (pass.length > 0) {
            if (!regex.test(pass)) {
                setError('password', 'Debe tener entre 8 y 15 caracteres (una Mayúscula y una Minúscula).');
            } else {
                clearErrors('password');
            }
        } else {
            clearErrors('password');
        }
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setData('password', val);
        validatePassword(val);
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setData('foto', imageSrc);
    }, [webcamRef, setData]);

    const submit = (e) => {
        e.preventDefault();

        // 1. Validar coincidencia de contraseñas
        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Las contraseñas no coinciden.');
            return;
        }

        // 2. Validar edad (18 - 90 años)
        if (data.fecha_nacimiento) {
            const fechaNac = new Date(data.fecha_nacimiento);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            
            // Ajuste por si aún no ha llegado su día de cumpleaños en el mes actual
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }

            if (edad < 18 || edad > 90) {
                setError('fecha_nacimiento', `Edad no permitida: ${edad} años. Debe estar entre 18 y 90.`);
                return;
            }
        } else {
            setError('fecha_nacimiento', 'La fecha de nacimiento es obligatoria.');
            return;
        }

        post(route('socios.store'));
    };

    const membresiaInfo = {
        Celeste: { label: 'Celeste', desc: 'Acceso estándar a instalaciones comunes.', color: '#00BFFF', icon: '🔵' },
        Dorado:  { label: 'Dorado',  desc: 'Acceso intermedio con beneficios extra.', color: '#FFD700', icon: '🥇' },
        Platino: { label: 'Platino', desc: 'Acceso VIP y áreas exclusivas premium.', color: '#E5E4E2', icon: '💎' },
    };

    const infoActual = membresiaInfo[data.tipo_membresia] ?? membresiaInfo.Platino;

    return (
        <AppSidebarLayout title="Nuevo Socio">
            <div className="max-w-5xl mx-auto p-4">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        Inscripción de <span>Socio</span>
                    </h1>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="label-style">Nombres</label>
                                    <input type="text" value={data.nombres} className="input-style" onChange={e => setData('nombres', e.target.value)} />
                                    {errors.nombres && <span className="err">{errors.nombres}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Apellidos</label>
                                    <input type="text" value={data.apellidos} className="input-style" onChange={e => setData('apellidos', e.target.value)} />
                                    {errors.apellidos && <span className="err">{errors.apellidos}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">CI</label>
                                    <input 
                                        type="text" 
                                        value={data.ci} 
                                        className="input-style" 
                                        maxLength={8}
                                        onChange={e => setData('ci', e.target.value.replace(/\D/g, ''))} 
                                    />
                                    {errors.ci && <span className="err">{errors.ci}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Email</label>
                                    <input type="email" value={data.email} className="input-style" onChange={e => setData('email', e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Contraseña (Máx 15)</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        maxLength={15}
                                        className={`input-style ${errors.password ? 'border-red-500/50' : ''}`}
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.password && <span className="err">{errors.password}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        maxLength={15}
                                        className={`input-style ${errors.password_confirmation ? 'border-red-500/50' : ''}`}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && <span className="err">{errors.password_confirmation}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Fecha Nacimiento (18-90 años)</label>
                                    <input 
                                        type="date" 
                                        value={data.fecha_nacimiento} 
                                        min={fechaMin}
                                        max={fechaMax}
                                        className={`input-style ${errors.fecha_nacimiento ? 'border-red-500' : ''}`} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            const anioIntroducido = new Date(val).getFullYear();
                                            const anioMaximo = new Date(fechaMax).getFullYear();

                                            // Si el usuario intenta escribir un año mayor al permitido (ej. 5555)
                                            if (anioIntroducido > anioMaximo) {
                                                // Opcional: Podrías resetearlo a la fecha máxima o dejarlo vacío
                                                setData('fecha_nacimiento', fechaMax); 
                                                setError('fecha_nacimiento', 'El año no es válido.');
                                            } else {
                                                setData('fecha_nacimiento', val);
                                                if (errors.fecha_nacimiento) clearErrors('fecha_nacimiento');
                                            }
                                        }} 
                                    />
                                    {errors.fecha_nacimiento && <span className="err">{errors.fecha_nacimiento}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Teléfono</label>
                                    <input 
                                        type="text" 
                                        value={data.telefono} 
                                        maxLength={8}
                                        className="input-style" 
                                        onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))} 
                                    />
                                </div>

                                <div className="md:col-span-2 mt-4">
                                    <div className="membresia-sep">
                                        <span>Plan de Membresía</span>
                                    </div>
                                    <div className="membresia-cards mt-4">
                                        {Object.entries(membresiaInfo).map(([key, info]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`mem-card ${data.tipo_membresia === key ? 'mem-card--active' : ''}`}
                                                style={data.tipo_membresia === key ? { borderColor: info.color } : {}}
                                                onClick={() => setData('tipo_membresia', key)}
                                            >
                                                <span className="mem-icon">{info.icon}</span>
                                                <span className="mem-label" style={data.tipo_membresia === key ? { color: info.color } : {}}>{info.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mem-desc" style={{ borderColor: infoActual.color + '44' }}>
                                        {infoActual.desc}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                <label className="label-style mb-4 text-center">Foto Reconocimiento</label>
                                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black">
                                    {!imgSrc ? (
                                        <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={imgSrc} className="w-full h-full object-cover" alt="Captura" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={imgSrc ? () => { setImgSrc(null); setData('foto', null); } : capture}
                                    className={`mt-4 w-full py-2 rounded-xl font-bold transition-all ${imgSrc ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500 text-slate-900'}`}
                                >
                                    {imgSrc ? 'Repetir Foto' : 'Tomar Captura'}
                                </button>
                                {errors.foto && <span className="err mt-2">{errors.foto}</span>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !imgSrc || errors.password || errors.fecha_nacimiento}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-black uppercase text-white shadow-xl disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Confirmar Registro'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .label-style { display: block; color: #1CE0EB; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem; }
                .input-style { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0.8rem; color: white; outline: none; }
                .input-style:focus { border-color: #1CE0EB; }
                .err { color: #f87171; font-size: 0.75rem; margin-top: 0.25rem; display: block; }
                .membresia-sep { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; color: #1CE0EB; font-weight: 800; }
                .membresia-cards { display: flex; gap: 0.75rem; }
                .mem-card { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 0.85rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; }
                .mem-card--active { background: rgba(0,0,0,0.4); }
                .mem-icon { font-size: 1.5rem; }
                .mem-label { font-size: 0.7rem; font-weight: 800; margin-top: 0.3rem; text-transform: uppercase; }
                .mem-desc { margin-top: 1rem; padding: 0.75rem; border-radius: 12px; border: 1px solid; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.6); font-size: 0.8rem; }
            `}</style>
        </AppSidebarLayout>
    );
}