import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { Head } from '@inertiajs/react';

export default function Panel({ user, socio }) {
    return (
        <AppSidebarLayout title="Carnet del Socio">
            <Head title="Carnet Socio" />

            <div className="flex justify-center items-center min-h-screen p-6 bg-slate-950">

                {/* 🪪 CARNET */}
                <div className="w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] text-white relative">

                    {/* 🔵 Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-5 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black tracking-wider text-white">CLUB BOLÍVAR</h1>
                            <p className="text-sm opacity-90 uppercase tracking-widest text-white">Carnet de Socio Oficial</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs opacity-70 text-white uppercase tracking-widest">ID Socio</p>
                            <p className="text-xl font-mono font-bold tracking-tighter text-white">{socio?.numero_socio}</p>
                        </div>
                    </div>

                    {/* 📋 Contenido Principal */}
                    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '420px' }}>

                        {/* 📸 Columna Izquierda: Foto (40%) */}
                        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', borderRight: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={socio?.foto_path ? `/storage/${socio.foto_path}` : '/default-user.png'}
                                    style={{ width: '200px', height: '240px', objectFit: 'cover', borderRadius: '16px', border: '3px solid rgba(59,130,246,0.4)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}
                                    alt="Foto socio"
                                />
                                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '24px', height: '24px', backgroundColor: '#22c55e', borderRadius: '50%', border: '3px solid #020617' }}></div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '28px' }}>
                                <h2 style={{ fontSize: '26px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: '1.1', marginBottom: '8px' }}>
                                    {socio?.nombres} <br />
                                    <span style={{ color: '#60a5fa' }}>{socio?.apellidos}</span>
                                </h2>
                                <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8, marginTop: '8px' }}>
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* 📋 Columna Derecha: Info (60%) */}
                        <div style={{ width: '60%', padding: '48px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px 48px', width: '100%' }}>

                                <div>
                                    <p style={{ fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', marginBottom: '6px' }}>Documento (CI)</p>
                                    <p style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>{socio?.ci || '---'}</p>
                                </div>

                                <div>
                                    <p style={{ fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', marginBottom: '6px' }}>Membresía</p>
                                    <p style={{ fontSize: '22px', fontWeight: '700', color: '#CD7F32' }}>{socio?.tipo_membresia || 'Bronce'}</p>
                                </div>

                                <div>
                                    <p style={{ fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', marginBottom: '6px' }}>Teléfono</p>
                                    <p style={{ fontSize: '22px', fontWeight: '700' }}>{socio?.telefono || '---'}</p>
                                </div>

                                <div>
                                    <p style={{ fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', marginBottom: '6px' }}>Estado</p>
                                    <span style={{ padding: '4px 14px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80', borderRadius: '999px', fontSize: '11px', fontWeight: '900', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        {socio?.estado || 'Activo'}
                                    </span>
                                </div>

                                <div>
                                    <p style={{ fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', marginBottom: '6px' }}>Fecha Ingreso</p>
                                    <p style={{ fontSize: '22px', fontWeight: '700' }}>
                                        {socio?.fecha_ingreso ? new Date(socio.fecha_ingreso).toLocaleDateString() : '23/4/2026'}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ✨ Footer */}
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', textAlign: 'center', padding: '14px', fontSize: '11px', color: '#6b7280', display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ opacity: 0.5, letterSpacing: '3px', textTransform: 'uppercase' }}>Sistema de Control de Acceso</span>
                        <div style={{ width: '4px', height: '4px', backgroundColor: '#374151', borderRadius: '50%' }}></div>
                        <span style={{ fontWeight: '700', color: '#9ca3af' }}>BOLÍVAR 2026 • IA + QR</span>
                    </div>

                </div>
            </div>
        </AppSidebarLayout>
    );
}