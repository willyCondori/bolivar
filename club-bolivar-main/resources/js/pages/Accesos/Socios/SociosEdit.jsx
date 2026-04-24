import { useForm, Head } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

export default function SociosEdit({ socio }) {
    // Estados para la gestión de imágenes
    const [preview, setPreview] = useState(socio.foto_path ? `/storage/${socio.foto_path}` : null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    
    // Referencias
    const fileInputRef = useRef();
    const webcamRef = useRef(null);

    // Formulario de Inertia
    const { data, setData, post, errors, processing } = useForm({
        nombres: socio.nombres || '',
        apellidos: socio.apellidos || '',
        ci: socio.ci || '',
        email: socio.email || '',
        telefono: socio.telefono || '',
        direccion: socio.direccion || '',
        fecha_nacimiento: socio.fecha_nacimiento || '',
        tipo_membresia: socio.tipo_membresia || 'Bronce',
        estado: socio.estado || 'Activo',
        estado_aprobacion: socio.estado_aprobacion || 'En espera',
        observaciones: socio.observaciones || '',
        foto: null, // Archivo o Base64
        _method: 'PUT', 
    });

    // --- LÓGICA DE ARCHIVO ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto', file); // Guardamos el archivo binario
            setPreview(URL.createObjectURL(file));
            setShowOptions(false);
        }
    };

    // --- LÓGICA DE WEBCAM ---
    const videoConstraints = { width: 480, height: 480, facingMode: "user" };

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPreview(imageSrc);
        setData('foto', imageSrc); // Guardamos el Base64 string
        setIsCameraOpen(false);
        setShowOptions(false);
    }, [webcamRef, setData]);

    const submit = (e) => {
        e.preventDefault();
        post(route('socios.update', socio.id));
    };

    return (
        <AppSidebarLayout title={`Editar Socio - ${socio.nombres}`}>
            <Head title={`Editar Socio - ${socio.nombres}`} />
            
            <style>{`
                .glass-form-card {
                    background: linear-gradient(180deg, rgba(10,20,35,.82), rgba(5,11,22,.92));
                    backdrop-filter: blur(18px);
                    border-radius: 28px;
                    border: 1px solid rgba(255,255,255,.07);
                    padding: 2.5rem;
                    max-width: 900px;
                    margin: 0 auto;
                    position: relative;
                }
                .form-input {
                    background: rgba(255,255,255,.05);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 12px;
                    color: #fff;
                    padding: 0.8rem 1rem;
                    width: 100%;
                    transition: all 0.2s;
                }
                .form-input:focus {
                    border-color: #1CE0EB; outline: none; background: rgba(255,255,255,.08);
                }
                
                /* Estilos de Foto Perfil */
                .photo-perfil-container {
                    width: 160px; height: 160px;
                    border-radius: 50%;
                    border: 4px solid #1CE0EB;
                    box-shadow: 0 0 20px rgba(28, 224, 235, 0.2);
                    overflow: hidden;
                    margin: 0 auto 2rem;
                    position: relative;
                    background: #050b16;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .photo-perfil-container:hover { transform: scale(1.03); }
                .photo-perfil-container img { width: 100%; height: 100%; object-fit: cover; }
                
                .photo-overlay {
                    position: absolute; bottom: 0; background: rgba(0,0,0,0.7);
                    width: 100%; text-align: center; color: #1CE0EB;
                    font-size: 11px; font-weight: 800; padding: 6px 0;
                    letter-spacing: 1px;
                }

                /* Modal/Opciones de Cámara */
                .camera-modal {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(10px); z-index: 50;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 2rem;
                }
                .webcam-capture { border-radius: 20px; border: 2px solid #1CE0EB; overflow: hidden; margin-bottom: 1rem; }
                
                label { color: rgba(224,247,248,.45); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; display: block; }
                .btn-cyan {
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #050b16; padding: 0.8rem 2.5rem; border-radius: 14px;
                    font-weight: 800; cursor: pointer; border: none; transition: opacity 0.2s;
                }
                .btn-cyan:hover { opacity: 0.9; }
                .btn-secondary {
                    background: rgba(255,255,255,0.1); color: white; padding: 0.8rem 2rem;
                    border-radius: 12px; font-weight: 600; cursor: pointer; border: none; margin-right: 1rem;
                }
                .form-section-title { color: #1CE0EB; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(28, 224, 235, 0.2); padding-bottom: 0.5rem; margin-top: 2rem; }
            `}</style>

            <div className="py-8 px-4">
                
                {/* MODAL DE CÁMARA IN-LIVE */}
                {isCameraOpen && (
                    <div className="camera-modal">
                        <div className="webcam-capture">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                mirrored={true}
                            />
                        </div>
                        <div className="flex">
                            <button type="button" className="btn-secondary" onClick={() => setIsCameraOpen(false)}>Cancelar</button>
                            <button type="button" className="btn-cyan" onClick={capturePhoto}>Tomar Foto</button>
                        </div>
                    </div>
                )}

                <div className="glass-form-card">
                    <form onSubmit={submit}>
                        
                        {/* GESTIÓN DE FOTO CON OPCIONES */}
                        <div className="relative text-center">
                            <div className="photo-perfil-container" onClick={() => setShowOptions(!showOptions)}>
                                {preview ? (
                                    <img src={preview} alt="Vista previa de perfil" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[#1CE0EB] font-bold">FOTO</div>
                                )}
                                <div className="photo-overlay">ACTUALIZAR</div>
                            </div>
                            
                            {/* Panel Flotante de Opciones */}
                            {showOptions && (
                                <div className="absolute top-0 left-1/2 transform translate-x-10 bg-[#0a1423] border border-white/10 p-4 rounded-xl z-10 shadow-xl w-48 text-left">
                                    <button type="button" className="block w-full text-left text-sm text-white hover:text-[#1CE0EB] py-2" onClick={() => { fileInputRef.current.click(); setShowOptions(false); }}>
                                        📁 Subir Archivo
                                    </button>
                                    <button type="button" className="block w-full text-left text-sm text-white hover:text-[#1CE0EB] py-2" onClick={() => { setIsCameraOpen(true); setShowOptions(false); }}>
                                        📷 Usar Cámara
                                    </button>
                                </div>
                            )}

                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                            {errors.foto && <div className="text-red-400 text-xs mt-1 mb-4 text-center">{errors.foto}</div>}
                        </div>

                        <h2 className="text-2xl font-bold mb-8 text-white text-center">Editar Perfil: <span className="text-[#1CE0EB]">{socio.nombres} {socio.apellidos}</span></h2>
                        
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div className="form-section-title">Información Personal</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label>Nombres</label>
                                <input className="form-input" value={data.nombres} onChange={e => setData('nombres', e.target.value)} />
                                {errors.nombres && <div className="text-red-400 text-xs mt-1">{errors.nombres}</div>}
                            </div>
                            <div>
                                <label>Apellidos</label>
                                <input className="form-input" value={data.apellidos} onChange={e => setData('apellidos', e.target.value)} />
                            </div>
                            <div>
                                <label>C.I. (Documento Nacional)</label>
                                <input className="form-input" value={data.ci} onChange={e => setData('ci', e.target.value)} />
                            </div>
                            <div>
                                <label>Fecha de Nacimiento</label>
                                <input type="date" className="form-input" value={data.fecha_nacimiento} onChange={e => setData('fecha_nacimiento', e.target.value)} />
                            </div>
                        </div>

                        {/* SECCIÓN 2: CONTACTO */}
                        <div className="form-section-title">Contacto</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label>Correo Electrónico</label>
                                <input type="email" className="form-input" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </div>
                            <div>
                                <label>Teléfono</label>
                                <input className="form-input" value={data.telefono} onChange={e => setData('telefono', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label>Dirección</label>
                                <input className="form-input" value={data.direccion} onChange={e => setData('direccion', e.target.value)} />
                            </div>
                        </div>

                        {/* SECCIÓN 3: MEMBRESÍA */}
                        <div className="form-section-title">Membresía del Club</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <label>Tipo (Categoría)</label>
                                <select className="form-input" value={data.tipo_membresia} onChange={e => setData('tipo_membresia', e.target.value)}>
                                    <option value="Bronce">Bronce</option>
                                    <option value="Plata">Plata</option>
                                    <option value="Oro">Oro</option>
                                </select>
                            </div>
                            <div>
                                <label>Estado</label>
                                <select className="form-input" value={data.estado} onChange={e => setData('estado', e.target.value)}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Bloqueado">Bloqueado</option>
                                </select>
                            </div>
                            <div>
                                <label>Aprobación</label>
                                <select className="form-input" value={data.estado_aprobacion} onChange={e => setData('estado_aprobacion', e.target.value)}>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="En espera">En espera</option>
                                    <option value="Rechazado">Rechazado</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end items-center pt-6 border-t border-white/10 mt-12">
                            <button type="submit" className="btn-cyan" disabled={processing}>
                                {processing ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}