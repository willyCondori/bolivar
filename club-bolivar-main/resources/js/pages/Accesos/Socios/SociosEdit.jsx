import { useForm, Head } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

// ── helpers ──────────────────────────────────────────────────────────────────
const hoy = new Date();
const dateLimit = (yearsAgo) =>
    new Date(hoy.getFullYear() - yearsAgo, hoy.getMonth(), hoy.getDate())
        .toISOString().split('T')[0];

const Field = ({ label, error, children }) => (
    <div>
        <label>{label}</label>
        {children}
        {error && <p className="error-text">{error}</p>}
    </div>
);

// ── component ─────────────────────────────────────────────────────────────────
export default function SociosEdit({ socio }) {
    const [preview, setPreview]       = useState(socio.foto_path ? `/storage/${socio.foto_path}` : null);
    const [camera, setCamera]         = useState(false);
    const [showOpts, setShowOpts]     = useState(false);
    const fileRef  = useRef();
    const webcamRef = useRef();

    const { data, setData, post, errors, processing, setError, clearErrors } = useForm({
        nombres: socio.nombres || '', apellidos: socio.apellidos || '',
        ci: socio.ci || '', email: socio.email || '',
        telefono: socio.telefono || '', direccion: socio.direccion || '',
        fecha_nacimiento: socio.fecha_nacimiento || '',
        tipo_membresia: socio.tipo_membresia || 'Bronce',
        estado: socio.estado || 'Activo',
        estado_aprobacion: socio.estado_aprobacion || 'En espera',
        observaciones: socio.observaciones || '',
        foto: null, _method: 'PUT',
    });

    const validateAge = (fecha) => {
        if (!fecha) return;
        const d = new Date(fecha);
        let age = hoy.getFullYear() - d.getFullYear();
        if (hoy.getMonth() < d.getMonth() || (hoy.getMonth() === d.getMonth() && hoy.getDate() < d.getDate())) age--;
        age < 18 || age > 90
            ? setError('fecha_nacimiento', `Edad no permitida: ${age} años (debe estar entre 18 y 90).`)
            : clearErrors('fecha_nacimiento');
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('foto', file);
        setPreview(URL.createObjectURL(file));
        setShowOpts(false);
    };

    const capture = useCallback(() => {
        const src = webcamRef.current.getScreenshot();
        setPreview(src); setData('foto', src);
        setCamera(false); setShowOpts(false);
    }, [webcamRef, setData]);

    const submit = (e) => {
        e.preventDefault();
        const d = new Date(data.fecha_nacimiento);
        let age = hoy.getFullYear() - d.getFullYear();
        if (age < 18 || age > 90) return alert('La edad debe estar entre 18 y 90 años.');
        post(route('socios.update', socio.id));
    };

    return (
        <AppSidebarLayout title={`Editar Socio - ${socio.nombres}`}>
            <Head title={`Editar Socio - ${socio.nombres}`} />
            <style>{`
                .glass-form-card { background:linear-gradient(180deg,rgba(10,20,35,.82),rgba(5,11,22,.92)); backdrop-filter:blur(18px); border-radius:28px; border:1px solid rgba(255,255,255,.07); padding:2.5rem; max-width:900px; margin:0 auto; position:relative; }
                .form-input { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:12px; color:#fff; padding:.8rem 1rem; width:100%; transition:all .2s; }
                .form-input:focus { border-color:#1CE0EB; outline:none; background:rgba(255,255,255,.08); }
                .photo-perfil-container { width:160px; height:160px; border-radius:50%; border:4px solid #1CE0EB; box-shadow:0 0 20px rgba(28,224,235,.2); overflow:hidden; margin:0 auto 2rem; position:relative; background:#050b16; cursor:pointer; transition:transform .2s; }
                .photo-perfil-container:hover { transform:scale(1.03); }
                .photo-perfil-container img { width:100%; height:100%; object-fit:cover; }
                .photo-overlay { position:absolute; bottom:0; background:rgba(0,0,0,.7); width:100%; text-align:center; color:#1CE0EB; font-size:11px; font-weight:800; padding:6px 0; letter-spacing:1px; }
                .camera-modal { position:fixed; inset:0; background:rgba(0,0,0,.8); backdrop-filter:blur(10px); z-index:50; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; }
                .webcam-capture { border-radius:20px; border:2px solid #1CE0EB; overflow:hidden; margin-bottom:1rem; }
                label { color:rgba(224,247,248,.45); font-size:.85rem; font-weight:600; margin-bottom:.5rem; display:block; }
                .btn-cyan { background:linear-gradient(135deg,#1CE0EB,#15A3AB); color:#050b16; padding:.8rem 2.5rem; border-radius:14px; font-weight:800; cursor:pointer; border:none; transition:opacity .2s; }
                .btn-cyan:hover { opacity:.9; }
                .btn-secondary { background:rgba(255,255,255,.1); color:white; padding:.8rem 2rem; border-radius:12px; font-weight:600; cursor:pointer; border:none; margin-right:1rem; }
                .section-title { color:#1CE0EB; font-size:.75rem; text-transform:uppercase; letter-spacing:1px; margin:2rem 0 1.5rem; border-bottom:1px solid rgba(28,224,235,.2); padding-bottom:.5rem; }
                .error-text { color:#f87171; font-size:.75rem; margin-top:.25rem; }
            `}</style>

            <div className="py-8 px-4">
                {camera && (
                    <div className="camera-modal">
                        <div className="webcam-capture">
                            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
                                videoConstraints={{ width:480, height:480, facingMode:'user' }} mirrored />
                        </div>
                        <div className="flex">
                            <button type="button" className="btn-secondary" onClick={() => setCamera(false)}>Cancelar</button>
                            <button type="button" className="btn-cyan" onClick={capture}>Tomar Foto</button>
                        </div>
                    </div>
                )}

                <div className="glass-form-card">
                    <form onSubmit={submit}>
                        {/* Foto */}
                        <div className="relative text-center">
                            <div className="photo-perfil-container" onClick={() => setShowOpts(!showOpts)}>
                                {preview ? <img src={preview} alt="Perfil" /> : <div className="flex items-center justify-center h-full text-[#1CE0EB] font-bold">FOTO</div>}
                                <div className="photo-overlay">ACTUALIZAR</div>
                            </div>
                            {showOpts && (
                                <div className="absolute top-0 left-1/2 translate-x-10 bg-[#0a1423] border border-white/10 p-4 rounded-xl z-10 shadow-xl w-48 text-left">
                                    <button type="button" className="block w-full text-left text-sm text-white hover:text-[#1CE0EB] py-2" onClick={() => fileRef.current.click()}>📁 Subir Archivo</button>
                                    <button type="button" className="block w-full text-left text-sm text-white hover:text-[#1CE0EB] py-2" onClick={() => { setCamera(true); setShowOpts(false); }}>📷 Usar Cámara</button>
                                </div>
                            )}
                            <input type="file" ref={fileRef} className="hidden" onChange={handleFile} accept="image/*" />
                            {errors.foto && <p className="error-text text-center mb-4">{errors.foto}</p>}
                        </div>

                        <h2 className="text-2xl font-bold mb-8 text-white text-center">
                            Editar Perfil: <span className="text-[#1CE0EB]">{socio.nombres}</span>
                        </h2>

                        <p className="section-title">Información Personal</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Field label="Nombres" error={errors.nombres}>
                                <input className="form-input" value={data.nombres} onChange={e => setData('nombres', e.target.value)} />
                            </Field>
                            <Field label="Apellidos" error={errors.apellidos}>
                                <input className="form-input" value={data.apellidos} onChange={e => setData('apellidos', e.target.value)} />
                            </Field>
                            <Field label="C.I. (Solo números)" error={errors.ci}>
                                <input className="form-input" maxLength={8} value={data.ci} onChange={e => setData('ci', e.target.value.replace(/\D/g, ''))} />
                            </Field>
                            <Field label="Fecha de Nacimiento" error={errors.fecha_nacimiento}>
                                <input type="date" className="form-input" min={dateLimit(90)} max={dateLimit(18)}
                                    value={data.fecha_nacimiento}
                                    onChange={e => { setData('fecha_nacimiento', e.target.value); validateAge(e.target.value); }} />
                            </Field>
                        </div>

                        <p className="section-title">Contacto</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Field label="Correo Electrónico" error={errors.email}>
                                <input type="email" className="form-input" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </Field>
                            <Field label="Teléfono" error={errors.telefono}>
                                <input className="form-input" maxLength={8} value={data.telefono} onChange={e => setData('telefono', e.target.value.replace(/\D/g, ''))} />
                            </Field>
                            <div className="md:col-span-2">
                                <label>Dirección</label>
                                <input className="form-input" value={data.direccion} onChange={e => setData('direccion', e.target.value)} />
                            </div>
                        </div>

                        <p className="section-title">Membresía y Estado</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                ['tipo_membresia', 'Tipo de Membresía', ['Celeste','Dorado','Platino']],
                                ['estado',         'Estado Sistema',    ['Activo','Inactivo','Bloqueado']],
                                ['estado_aprobacion','Aprobación',      ['Aprobado','En espera','Rechazado']],
                            ].map(([field, lbl, opts]) => (
                                <Field key={field} label={lbl}>
                                    <select className="form-input" value={data[field]} onChange={e => setData(field, e.target.value)}>
                                        {opts.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </Field>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-white/10 mt-12">
                            <button type="submit" className="btn-cyan" disabled={processing || errors.fecha_nacimiento}>
                                {processing ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}