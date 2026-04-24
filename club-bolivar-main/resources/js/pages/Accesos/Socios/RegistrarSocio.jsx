import React, { useState, useRef, useCallback } from 'react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useForm, Head } from '@inertiajs/react';
import Webcam from 'react-webcam';

export default function RegistrarSocio() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        nombres: '',
        apellidos: '',
        ci: '',
        email: '',
        fecha_nacimiento: '',
        telefono: '',
        direccion: '',
        // Corregido: 'Bronce' es el valor inicial permitido por tu SQL
        tipo_membresia: 'Bronce', 
        foto: null,
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

    return (
        <AppSidebarLayout title="Nuevo Socio">
            <div className="max-w-5xl mx-auto p-4">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">Inscripción de <span>Socio</span></h1>
                    
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="label-style">Nombres</label>
                                    <input type="text" value={data.nombres} className="input-style" onChange={e => setData('nombres', e.target.value)} />
                                    {errors.nombres && <span className="text-red-500 text-xs">{errors.nombres}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="label-style">Apellidos</label>
                                    <input type="text" value={data.apellidos} className="input-style" onChange={e => setData('apellidos', e.target.value)} />
                                    {errors.apellidos && <span className="text-red-500 text-xs">{errors.apellidos}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="label-style">Cédula de Identidad</label>
                                    <input
                                        type="text"
                                        value={data.ci}
                                        className="input-style"
                                        maxLength={8}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ''); // SOLO números
                                            setData('ci', value);
                                        }}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="Ej: 12345678"
                                    />
                                    {errors.ci && <span className="text-red-500 text-xs">{errors.ci}</span>}
                                </div>                                
                                <div className="form-group">
                                    <label className="label-style">Email</label>
                                    <input type="email" value={data.email} className="input-style" onChange={e => setData('email', e.target.value)} />
                                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="label-style">Teléfono</label>
                                    <input
                                        type="text"
                                        value={data.telefono}
                                        className="input-style"
                                        maxLength={8}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ''); // solo números

                                            // validar inicio 6 o 7
                                            if (value.length === 0 || ['6', '7'].includes(value[0])) {
                                                setData('telefono', value);
                                            }
                                        }}
                                        placeholder="Ej: 71234567"
                                    />
                                    {errors.telefono && (
                                        <span className="text-red-500 text-xs">{errors.telefono}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="label-style">Fecha Nacimiento</label>
                                    <input type="date" value={data.fecha_nacimiento} className="input-style" onChange={e => setData('fecha_nacimiento', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="label-style">Tipo Membresía</label>
                                    {/* Select actualizado con tus valores de SQL */}
                                    <select 
                                        className="input-style" 
                                        value={data.tipo_membresia}
                                        onChange={e => setData('tipo_membresia', e.target.value)}
                                    >
                                        <option value="Bronce">Bronce</option>
                                        <option value="Plata">Plata</option>
                                        <option value="Oro">Oro</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label-style">Dirección de Domicilio</label>
                                    <textarea value={data.direccion} className="input-style h-20" onChange={e => setData('direccion', e.target.value)}></textarea>
                                </div>
                            </div>

                            <div className="flex flex-col items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                <label className="label-style mb-4 text-center">Fotografía para IA</label>
                                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black">
                                    {!imgSrc ? (
                                        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={imgSrc} className="w-full h-full object-cover" alt="Captura" />
                                    )}
                                </div>
                                <button type="button" onClick={imgSrc ? () => setImgSrc(null) : capture} 
                                    className={`mt-4 w-full py-2 rounded-xl font-bold transition-all ${imgSrc ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'}`}>
                                    {imgSrc ? 'Repetir Foto' : 'Tomar Captura'}
                                </button>
                                {errors.foto && <span className="text-red-500 text-xs mt-2">{errors.foto}</span>}
                            </div>

                        </div>

                        <button 
                            type="submit" 
                            disabled={processing || !imgSrc} 
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-900/40 hover:scale-[1.01] transition-transform disabled:opacity-50"
                        >
                            {processing ? 'Guardando en base de datos...' : 'Confirmar y Crear Registro Maestro'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .label-style { display: block; color: #1CE0EB; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .input-style { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0.8rem; color: white; outline: none; transition: all 0.3s ease; }
                .input-style:focus { border-color: #1CE0EB; background: rgba(0,0,0,0.6); box-shadow: 0 0 20px rgba(28,224,235,0.15); }
                select.input-style option { background: #0f172a; color: white; }
            `}</style>
        </AppSidebarLayout>
    );
}