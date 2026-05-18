import React, { useState, useRef, useCallback } from 'react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useForm } from '@inertiajs/react';
import Webcam from 'react-webcam';

// ── Pasos de fotos ────────────────────────────────────────────────────────────
const PASOS_FOTO = [
    {
        etiqueta: 'frontal',
        requerida: true,
        titulo: 'Foto Frontal',
        instruccion: 'Mira directo a la cámara, rostro completo visible',
        icono: '😐',
        detalle: 'Sin lentes, sin gorro. Iluminación frontal.',
    },
    {
        etiqueta: 'lateral_izq',
        requerida: true,
        titulo: 'Perfil Izquierdo',
        instruccion: 'Gira tu cabeza hacia la izquierda (~45°)',
        icono: '👤',
        detalle: 'Mantén el rostro visible. No exageres el giro.',
    },
    {
        etiqueta: 'lateral_der',
        requerida: true,
        titulo: 'Perfil Derecho',
        instruccion: 'Gira tu cabeza hacia la derecha (~45°)',
        icono: '👤',
        detalle: 'Igual que el anterior pero al otro lado.',
        espejar: true,
    },
    {
        etiqueta: 'lentes',
        requerida: false,
        titulo: 'Con Lentes (Opcional)',
        instruccion: 'Si usas lentes habitualmente, póntelos ahora',
        icono: '🕶️',
        detalle: 'Solo si usas lentes regularmente. Si no, omite este paso.',
    },
];

// ── helpers ───────────────────────────────────────────────────────────────────
const hoy = new Date();
const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()).toISOString().split('T')[0];
const fechaMin = new Date(hoy.getFullYear() - 80, hoy.getMonth(), hoy.getDate()).toISOString().split('T')[0];

function b64ToFile(b64, nombre = 'foto.jpg') {
    const arr = b64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new File([u8], nombre, { type: mime });
}

// ── component ─────────────────────────────────────────────────────────────────
export default function RegistrarSocio() {
    // fotos[etiqueta] = { src: base64, file: File }
    const [fotos, setFotos] = useState({});
    const [pasoFoto, setPasoFoto] = useState(0); // índice de PASOS_FOTO activo
    const webcamRef = useRef(null);

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
        // foto principal (frontal) como base64
        foto: null,
        // fotos adicionales como JSON de etiquetas
        fotos_extra: null,
        tipo_membresia: 'Platino',
    });

    // ── captura para el paso actual ──────────────────────────────────────────
    const capture = useCallback(() => {
        const src = webcamRef.current?.getScreenshot();
        if (!src) return;
        const paso = PASOS_FOTO[pasoFoto];
        const nuevasFotos = { ...fotos, [paso.etiqueta]: { src, file: b64ToFile(src, `${paso.etiqueta}.jpg`) } };
        setFotos(nuevasFotos);

        // foto principal = frontal
        if (paso.etiqueta === 'frontal') {
            setData('foto', src);
        }

        // Avanzar automáticamente al siguiente paso
        if (pasoFoto < PASOS_FOTO.length - 1) {
            setTimeout(() => setPasoFoto(pasoFoto + 1), 600);
        }
    }, [webcamRef, pasoFoto, fotos, setData]);

    const repetir = (idx) => {
        const paso = PASOS_FOTO[idx];
        const nuevasFotos = { ...fotos };
        delete nuevasFotos[paso.etiqueta];
        setFotos(nuevasFotos);
        setPasoFoto(idx);
    };

    const omitirOpcional = () => {
        if (pasoFoto < PASOS_FOTO.length - 1) setPasoFoto(pasoFoto + 1);
    };

    const pasosRequeridosCompletos = PASOS_FOTO
        .filter(p => p.requerida)
        .every(p => fotos[p.etiqueta]);

    // ── validaciones ──────────────────────────────────────────────────────────
    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
        if (pass.length > 0 && !regex.test(pass)) {
            setError('password', 'Debe tener entre 8 y 15 caracteres (una Mayúscula y una Minúscula).');
        } else {
            clearErrors('password');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Las contraseñas no coinciden.');
            return;
        }
        if (!data.fecha_nacimiento) {
            setError('fecha_nacimiento', 'La fecha de nacimiento es obligatoria.');
            return;
        }
        if (!pasosRequeridosCompletos) {
            alert('Completa todas las fotos requeridas antes de registrar.');
            return;
        }

        // Armar fotos_extra (todas excepto frontal)
        const extras = Object.entries(fotos)
            .filter(([etiqueta]) => etiqueta !== 'frontal')
            .map(([etiqueta, { src }]) => ({ etiqueta, src }));

        setData('fotos_extra', JSON.stringify(extras));

        // Pequeño delay para que setData se propague
        setTimeout(() => post(route('socios.store')), 50);
    };

    const membresiaInfo = {
        Celeste: { label: 'Celeste', desc: 'Acceso VIP y áreas exclusivas premium.', color: '#00BFFF', icon: '🔵' },
        Dorado:  { label: 'Dorado',  desc: 'Acceso intermedio con beneficios extra.', color: '#FFD700', icon: '🥇' },
        Platino: { label: 'Platino', desc: 'Acceso estándar a instalaciones comunes.', color: '#E5E4E2', icon: '💎' },
    };
    const infoActual = membresiaInfo[data.tipo_membresia] ?? membresiaInfo.Platino;
    const pasoActual = PASOS_FOTO[pasoFoto];

    return (
        <AppSidebarLayout title="Nuevo Socio">
            <div className="max-w-5xl mx-auto p-4">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        Inscripción de <span>Socio</span>
                    </h1>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* ── Datos personales ── */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="form-group">
                                    <label className="label-style">Nombres</label>
                                    <input type="text" value={data.nombres} className="input-style"
                                        onChange={e => setData('nombres', e.target.value)} />
                                    {errors.nombres && <span className="err">{errors.nombres}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Apellidos</label>
                                    <input type="text" value={data.apellidos} className="input-style"
                                        onChange={e => setData('apellidos', e.target.value)} />
                                    {errors.apellidos && <span className="err">{errors.apellidos}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">CI</label>
                                    <input type="text" value={data.ci} className="input-style" maxLength={8}
                                        onChange={e => setData('ci', e.target.value.replace(/\D/g, ''))} />
                                    {errors.ci && <span className="err">{errors.ci}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Email</label>
                                    <input type="email" value={data.email} className="input-style"
                                        onChange={e => setData('email', e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Contraseña (Máx 15)</label>
                                    <input type="password" value={data.password} maxLength={15}
                                        className={`input-style ${errors.password ? 'border-red-500/50' : ''}`}
                                        onChange={e => { setData('password', e.target.value); validatePassword(e.target.value); }} />
                                    {errors.password && <span className="err">{errors.password}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Confirmar Contraseña</label>
                                    <input type="password" value={data.password_confirmation} maxLength={15}
                                        className={`input-style ${errors.password_confirmation ? 'border-red-500/50' : ''}`}
                                        onChange={e => setData('password_confirmation', e.target.value)} />
                                    {errors.password_confirmation && <span className="err">{errors.password_confirmation}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Fecha Nacimiento (18–80 años)</label>
                                    <input type="date" value={data.fecha_nacimiento} min={fechaMin} max={fechaMax}
                                        className={`input-style ${errors.fecha_nacimiento ? 'border-red-500' : ''}`}
                                        onChange={e => { setData('fecha_nacimiento', e.target.value); clearErrors('fecha_nacimiento'); }} />
                                    {errors.fecha_nacimiento && <span className="err">{errors.fecha_nacimiento}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Teléfono</label>
                                    <input type="text" value={data.telefono} maxLength={8} className="input-style"
                                        onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))} />
                                </div>

                                <div className="form-group">
                                    <label className="label-style">Dirección</label>
                                    <input type="text" value={data.direccion} className="input-style"
                                        onChange={e => setData('direccion', e.target.value)} />
                                </div>

                                {/* Membresía */}
                                <div className="md:col-span-2 mt-4">
                                    <div className="membresia-sep"><span>Plan de Membresía</span></div>
                                    <div className="membresia-cards mt-4">
                                        {Object.entries(membresiaInfo).map(([key, info]) => (
                                            <button key={key} type="button"
                                                className={`mem-card ${data.tipo_membresia === key ? 'mem-card--active' : ''}`}
                                                style={data.tipo_membresia === key ? { borderColor: info.color } : {}}
                                                onClick={() => setData('tipo_membresia', key)}>
                                                <span className="mem-icon">{info.icon}</span>
                                                <span className="mem-label" style={data.tipo_membresia === key ? { color: info.color } : {}}>{info.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mem-desc" style={{ borderColor: infoActual.color + '44' }}>{infoActual.desc}</div>
                                </div>
                            </div>

                            {/* ── Panel de fotos multi-paso ── */}
                            <div className="flex flex-col bg-white/5 p-4 rounded-3xl border border-white/10 gap-4">

                                {/* Progreso de pasos */}
                                <div className="flex gap-1 justify-center">
                                    {PASOS_FOTO.map((p, i) => (
                                        <div key={p.etiqueta} className="flex flex-col items-center gap-1 cursor-pointer"
                                            onClick={() => setPasoFoto(i)}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                ${fotos[p.etiqueta] ? 'bg-green-500 text-white' :
                                                  i === pasoFoto ? 'bg-cyan-500 text-slate-900' :
                                                  'bg-white/10 text-white/40'}`}>
                                                {fotos[p.etiqueta] ? '✓' : i + 1}
                                            </div>
                                            {!p.requerida && (
                                                <span className="text-[9px] text-yellow-400 font-bold">OPC</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Instrucción del paso actual */}
                                <div className={`rounded-2xl p-3 border text-center transition-all
                                    ${pasoActual.requerida
                                        ? 'border-cyan-500/30 bg-cyan-500/5'
                                        : 'border-yellow-500/30 bg-yellow-500/5'}`}>
                                    <div className="text-2xl mb-1">{pasoActual.icono}</div>
                                    <div className={`text-xs font-black uppercase tracking-widest mb-1
                                        ${pasoActual.requerida ? 'text-cyan-400' : 'text-yellow-400'}`}>
                                        {pasoActual.titulo}
                                        {!pasoActual.requerida && ' · Opcional'}
                                    </div>
                                    <div className="text-white/80 text-xs font-semibold">{pasoActual.instruccion}</div>
                                    <div className="text-white/40 text-[10px] mt-1">{pasoActual.detalle}</div>
                                </div>

                                {/* Cámara / preview */}
                                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black"
                                    style={{ aspectRatio: '3/4' }}>
                                    {fotos[pasoActual.etiqueta] ? (
                                        <img src={fotos[pasoActual.etiqueta].src}
                                            className="w-full h-full object-cover" alt="Captura" />
                                    ) : (
                                        <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg"
                                            mirrored={!!pasoActual.espejar}
                                            className="w-full h-full object-cover" />
                                    )}

                                    {/* Badge de estado */}
                                    {fotos[pasoActual.etiqueta] && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            ✓ Capturada
                                        </div>
                                    )}
                                </div>

                                {/* Botones */}
                                <div className="flex flex-col gap-2">
                                    {fotos[pasoActual.etiqueta] ? (
                                        <button type="button" onClick={() => repetir(pasoFoto)}
                                            className="w-full py-2 rounded-xl font-bold bg-red-500/20 text-red-400 text-sm">
                                            🔄 Repetir
                                        </button>
                                    ) : (
                                        <button type="button" onClick={capture}
                                            className="w-full py-2 rounded-xl font-bold bg-cyan-500 text-slate-900 text-sm">
                                            📸 Tomar Foto
                                        </button>
                                    )}

                                    {/* Omitir solo si es opcional */}
                                    {!pasoActual.requerida && !fotos[pasoActual.etiqueta] && pasoFoto < PASOS_FOTO.length - 1 && (
                                        <button type="button" onClick={omitirOpcional}
                                            className="w-full py-1.5 rounded-xl font-bold bg-white/5 text-white/50 text-xs border border-white/10">
                                            Omitir este paso
                                        </button>
                                    )}
                                </div>

                                {/* Miniaturas de fotos tomadas */}
                                <div className="grid grid-cols-4 gap-1 mt-1">
                                    {PASOS_FOTO.map((p, i) => (
                                        <div key={p.etiqueta}
                                            onClick={() => setPasoFoto(i)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all
                                                ${i === pasoFoto ? 'border-cyan-500' : 'border-white/10'}
                                                ${!fotos[p.etiqueta] && !p.requerida ? 'opacity-40' : ''}`}>
                                            {fotos[p.etiqueta] ? (
                                                <img src={fotos[p.etiqueta].src} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-base">
                                                    {p.icono}
                                                </div>
                                            )}
                                            {!p.requerida && (
                                                <div className="absolute bottom-0 w-full bg-yellow-500/70 text-[8px] text-center font-bold text-slate-900">OPC</div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {errors.foto && <span className="err text-center">{errors.foto}</span>}
                            </div>
                        </div>

                        <button type="submit"
                            disabled={processing || !pasosRequeridosCompletos || errors.password || errors.fecha_nacimiento}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-black uppercase text-white shadow-xl disabled:opacity-50">
                            {processing ? 'Guardando...' : `Confirmar Registro ${!pasosRequeridosCompletos ? '(Fotos pendientes)' : ''}`}
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