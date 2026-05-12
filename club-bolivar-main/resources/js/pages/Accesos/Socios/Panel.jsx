import { Head, router } from '@inertiajs/react';
import { QRCodeCanvas } from 'qrcode.react';

export default function Panel({ user, socio, membresia }) {

    const membresiaColor = membresia?.tipo === 'Celeste' ? '#38BDF8' : membresia?.tipo === 'Dorado' ? '#FACC15' : membresia?.tipo === 'Platino' ? '#E5E7EB' : '#CD7F32';

    const fotoSrc = socio?.foto_path ? `/storage/${socio.foto_path}` : '/img/default-avatar.png';

    const fechaIngreso = socio?.fecha_ingreso ? new Date(socio.fecha_ingreso).toLocaleDateString() : '---';

    const labelStyle = { fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', marginBottom: '6px' };

    const valueStyle = { fontSize: '22px', fontWeight: '700', color: 'white' };

    return (
        <>
            <Head title="Carnet Socio" />

            <div id="logout-container" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50 }}>
                <button id="btn-logout" onClick={() => router.post(route('logout'))} style={{ background: 'linear-gradient(135deg,#1CE0EB,#15A3AB)', color: '#031019', padding: '8px 20px', borderRadius: '10px', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                    Cerrar sesión
                </button>
            </div>

            <div id="panel-container" style={{ minHeight: '100vh', background: '#020617', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>

                <div id="carnet-card" className="w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] text-white relative">

                    <div id="card-header" className="bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-5 flex items-center justify-between">
                        <div>
                            <h1 id="club-title" className="text-2xl font-black tracking-wider text-white">CLUB BOLÍVAR</h1>
                            <p id="card-subtitle" className="text-sm opacity-90 uppercase tracking-widest text-white">Carnet de Socio Oficial</p>
                        </div>

                        <div className="text-right">
                            <p id="label-id-socio" className="text-xs opacity-70 text-white uppercase tracking-widest">ID Socio</p>
                            <p id="numero-socio" className="text-xl font-mono font-bold tracking-tighter text-white">{socio?.numero_socio}</p>
                        </div>
                    </div>

                    <div id="qr-container" style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '10px', borderRadius: '12px' }}>
                        <QRCodeCanvas id="qr-code" value={socio?.qr_token || ''} size={120} />
                    </div>

                    <div id="card-content" style={{ display: 'flex', flexDirection: 'row', minHeight: '420px' }}>

                        <div id="foto-section" style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', borderRight: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>

                            <div id="foto-wrapper" style={{ position: 'relative' }}>
                                <img id="foto-socio" src={fotoSrc} alt="Foto socio" style={{ width: '200px', height: '240px', objectFit: 'cover', borderRadius: '16px', border: '3px solid rgba(59,130,246,0.4)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }} />

                                <div id="estado-indicador" style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '24px', height: '24px', backgroundColor: '#22c55e', borderRadius: '50%', border: '3px solid #020617' }}></div>
                            </div>

                            <div id="datos-principales" style={{ textAlign: 'center', marginTop: '28px' }}>
                                <h2 id="nombre-completo" style={{ fontSize: '26px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: '1.1', marginBottom: '8px' }}>
                                    {socio?.nombres}<br />
                                    <span id="apellido-socio" style={{ color: '#60a5fa' }}>{socio?.apellidos}</span>
                                </h2>

                                <p id="email-socio" style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8, marginTop: '8px' }}>
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div id="info-section" style={{ width: '60%', padding: '48px', display: 'flex', alignItems: 'center' }}>
                            <div id="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px 48px', width: '100%' }}>

                                <div id="ci-section">
                                    <p id="label-ci" style={labelStyle}>Documento (CI)</p>
                                    <p id="ci" style={valueStyle}>{socio?.ci || '---'}</p>
                                </div>

                                <div id="membresia-section">
                                    <p id="label-membresia" style={labelStyle}>Membresía</p>
                                    <p id="membresia" style={{ ...valueStyle, color: membresiaColor }}>{membresia?.tipo || 'Sin membresía'}</p>
                                </div>

                                <div id="telefono-section">
                                    <p id="label-telefono" style={labelStyle}>Teléfono</p>
                                    <p id="telefono" style={valueStyle}>{socio?.telefono || '---'}</p>
                                </div>

                                <div id="estado-section">
                                    <p id="label-estado" style={labelStyle}>Estado</p>

                                    <span id="estado" style={{ padding: '4px 14px', backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80', borderRadius: '999px', fontSize: '11px', fontWeight: '900', border: '1px solid rgba(34,197,94,0.25)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        {socio?.estado || 'Activo'}
                                    </span>
                                </div>

                                <div id="fecha-section">
                                    <p id="label-fecha" style={labelStyle}>Fecha Ingreso</p>
                                    <p id="fecha-ingreso" style={valueStyle}>{fechaIngreso}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}