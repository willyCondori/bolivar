import React, { useState, useRef, useCallback } from 'react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useForm } from '@inertiajs/react';
import Webcam from 'react-webcam';

export default function RegistrarSocio() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        // ── Datos del socio ──────────────────────────────────────
        nombres:               '',
        apellidos:             '',
        ci:                    '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        fecha_nacimiento:      '',
        telefono:              '',
        direccion:             '',
        foto:                  null,

        // ── Datos de membresía (van a tabla membresias) ──────────
        tipo_membresia: 'Platino',
    });

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setData('foto', imageSrc);
    }, [webcamRef, setData]);

    const submit = (e) => {
        e.preventDefault();
        post(route('socios.store'));
    };

    /* ── Descripción por tipo de membresía ─────────────────────── */
    const membresiaInfo = {
        Celeste: {
            label: 'Celeste',
            desc: 'Acceso estándar a instalaciones. Incluye todas las áreas comunes.',
            color: '#00BFFF',
            icon: '🔵',
        },
        Dorado: {
            label: 'Dorado',
            desc: 'Acceso intermedio con beneficios adicionales.',
            color: '#FFD700',
            icon: '🥇',
        },
        Platino: {
            label: 'Platino',
            desc: 'Acceso VIP, áreas exclusivas y beneficios premium.',
            color: '#E5E4E2',
            icon: '💎',
        },
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

                            {/* ── Columnas izquierda + centro ──────────────────── */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Nombres */}
                                <div className="form-group">
                                    <label className="label-style">Nombres</label>
                                    <input
                                        type="text"
                                        value={data.nombres}
                                        className="input-style"
                                        onChange={e => setData('nombres', e.target.value)}
                                    />
                                    {errors.nombres && <span className="err">{errors.nombres}</span>}
                                </div>

                                {/* Apellidos */}
                                <div className="form-group">
                                    <label className="label-style">Apellidos</label>
                                    <input
                                        type="text"
                                        value={data.apellidos}
                                        className="input-style"
                                        onChange={e => setData('apellidos', e.target.value)}
                                    />
                                    {errors.apellidos && <span className="err">{errors.apellidos}</span>}
                                </div>

                                {/* CI */}
                                <div className="form-group">
                                    <label className="label-style">Cédula de Identidad</label>
                                    <input
                                        type="text"
                                        value={data.ci}
                                        className="input-style"
                                        maxLength={8}
                                        placeholder="Ej: 12345678"
                                        onChange={e => {
                                            const v = e.target.value.replace(/\D/g, '');
                                            setData('ci', v);
                                        }}
                                        onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                                    />
                                    {errors.ci && <span className="err">{errors.ci}</span>}
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label className="label-style">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        className="input-style"
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <span className="err">{errors.email}</span>}
                                </div>

                                {/* Contraseña */}
                                <div className="form-group">
                                    <label className="label-style">Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        className="input-style"
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && <span className="err">{errors.password}</span>}
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="form-group">
                                    <label className="label-style">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        className="input-style"
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                </div>

                                {/* Teléfono */}
                                <div className="form-group">
                                    <label className="label-style">Teléfono</label>
                                    <input
                                        type="text"
                                        value={data.telefono}
                                        className="input-style"
                                        maxLength={8}
                                        placeholder="Ej: 71234567"
                                        onChange={e => {
                                            const v = e.target.value.replace(/\D/g, '');
                                            if (v.length === 0 || ['6', '7'].includes(v[0])) {
                                                setData('telefono', v);
                                            }
                                        }}
                                    />
                                    {errors.telefono && <span className="err">{errors.telefono}</span>}
                                </div>

                                {/* Fecha nacimiento */}
                                <div className="form-group">
                                    <label className="label-style">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        value={data.fecha_nacimiento}
                                        className="input-style"
                                        onChange={e => setData('fecha_nacimiento', e.target.value)}
                                    />
                                </div>

                                {/* Dirección — ancho completo */}
                                <div className="md:col-span-2">
                                    <label className="label-style">Dirección de Domicilio</label>
                                    <textarea
                                        value={data.direccion}
                                        className="input-style h-20"
                                        onChange={e => setData('direccion', e.target.value)}
                                    />
                                </div>

                                {/* ── Membresía ─────────────────────────────────── */}
                                {/* Separador visual */}
                                <div className="md:col-span-2">
                                    <div className="membresia-sep">
                                        <span>Membresía</span>
                                        <small>Se registra en la tabla de membresías · vigencia 1 mes</small>
                                    </div>
                                </div>

                                {/* Selector tipo membresía */}
                                <div className="form-group md:col-span-2">
                                    <label className="label-style">Tipo de Membresía</label>

                                    <div className="membresia-cards">
                                        {Object.entries(membresiaInfo).map(([key, info]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`mem-card ${data.tipo_membresia === key ? 'mem-card--active' : ''}`}
                                                style={data.tipo_membresia === key
                                                    ? { borderColor: info.color, boxShadow: `0 0 18px ${info.color}30` }
                                                    : {}}
                                                onClick={() => setData('tipo_membresia', key)}
                                            >
                                                <span className="mem-icon">{info.icon}</span>
                                                <span
                                                    className="mem-label"
                                                    style={data.tipo_membresia === key ? { color: info.color } : {}}
                                                >
                                                    {info.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Descripción dinámica */}
                                    <div
                                        className="mem-desc"
                                        style={{ borderColor: infoActual.color + '44' }}
                                    >
                                        <span style={{ color: infoActual.color }}>{infoActual.icon}</span>
                                        {infoActual.desc}
                                        <span className="mem-badge">
                                            Vigencia: 1 mes automático
                                        </span>
                                    </div>

                                    {errors.tipo_membresia && (
                                        <span className="err">{errors.tipo_membresia}</span>
                                    )}
                                </div>

                            </div>

                            {/* ── Columna derecha: foto ─────────────────────────── */}
                            <div className="flex flex-col items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                <label className="label-style mb-4 text-center">
                                    Fotografía para reconocimiento facial
                                </label>
                                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black">
                                    {!imgSrc ? (
                                        <Webcam
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img src={imgSrc} className="w-full h-full object-cover" alt="Captura" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={imgSrc ? () => { setImgSrc(null); setData('foto', null); } : capture}
                                    className={`mt-4 w-full py-2 rounded-xl font-bold transition-all ${
                                        imgSrc
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                            : 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'
                                    }`}
                                >
                                    {imgSrc ? 'Repetir Foto' : 'Tomar Captura'}
                                </button>
                                {errors.foto && <span className="err mt-2">{errors.foto}</span>}
                            </div>

                        </div>

                        {/* ── Botón submit ───────────────────────────────────── */}
                        <button
                            type="submit"
                            disabled={processing || !imgSrc}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-900/40 hover:scale-[1.01] transition-transform disabled:opacity-50"
                        >
                            {processing
                                ? 'Guardando en base de datos...'
                                : 'Confirmar y Crear Registro'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .label-style {
                    display: block;
                    color: #1CE0EB;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.05em;
                }
                .input-style {
                    width: 100%;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 14px;
                    padding: 0.8rem;
                    color: white;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .input-style:focus {
                    border-color: #1CE0EB;
                    background: rgba(0,0,0,0.6);
                    box-shadow: 0 0 20px rgba(28,224,235,0.15);
                }
                select.input-style option { background: #0f172a; color: white; }

                .err { color: #f87171; font-size: 0.75rem; margin-top: 0.25rem; display: block; }

                /* Separador membresía */
                .membresia-sep {
                    display: flex;
                    align-items: baseline;
                    gap: 0.75rem;
                    border-top: 1px solid rgba(255,255,255,0.07);
                    padding-top: 1rem;
                    margin-top: 0.5rem;
                }
                .membresia-sep span {
                    color: #1CE0EB;
                    font-size: 0.8rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .membresia-sep small {
                    color: rgba(255,255,255,0.3);
                    font-size: 0.72rem;
                }

                /* Cards de tipo membresía */
                .membresia-cards {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                }
                .mem-card {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.85rem 0.5rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .mem-card:hover { background: rgba(255,255,255,0.06); }
                .mem-card--active { background: rgba(0,0,0,0.4); }
                .mem-icon { font-size: 1.5rem; }
                .mem-label {
                    font-size: 0.78rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: rgba(255,255,255,0.5);
                }

                /* Descripción membresía */
                .mem-desc {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.03);
                    color: rgba(255,255,255,0.55);
                    font-size: 0.83rem;
                    line-height: 1.5;
                    flex-wrap: wrap;
                }
                .mem-badge {
                    margin-left: auto;
                    padding: 0.2rem 0.6rem;
                    border-radius: 8px;
                    background: rgba(28,224,235,0.1);
                    border: 1px solid rgba(28,224,235,0.2);
                    color: #1CE0EB;
                    font-size: 0.72rem;
                    font-weight: 700;
                    white-space: nowrap;
                }
            `}</style>
        </AppSidebarLayout>
    );
}