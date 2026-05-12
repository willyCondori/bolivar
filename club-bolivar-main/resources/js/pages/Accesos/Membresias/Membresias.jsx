import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

const MEMBRESIAS = {
    Celeste: { color:'#00BFFF', icon:'🔵' },
    Dorado:  { color:'#FFD700', icon:'🥇' },
    Platino: { color:'#E5E4E2', icon:'💎' },
};

export default function Membresias({ membresias = [] }) {

    return (
        <AppSidebarLayout title="Membresías">
            <div className="max-w-6xl mx-auto p-4">

                <div className="dashboard-card">
                    
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="dashboard-hero-title">
                            Gestión de <span>Membresías</span>
                        </h1>

                        <span className="text-xs text-gray-400">
                            Total tipos: {membresias.length}
                        </span>
                    </div>

                    {membresias.length === 0 && (
                        <p className="text-gray-400">
                            No hay membresías registradas
                        </p>
                    )}

                    {/* LISTA */}
                    <div className="space-y-6">
                        {membresias.map((grupo) => {
                            const mem = MEMBRESIAS[grupo.tipo] || {};

                            return (
                                <div key={grupo.tipo} className="membresia-group">

                                    {/* TITULO DEL GRUPO */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{mem.icon}</span>
                                            <h2
                                                className="font-bold text-lg"
                                                style={{ color: mem.color || '#1CE0EB' }}
                                            >
                                                {grupo.tipo}
                                            </h2>
                                        </div>

                                        <span className="badge-total">
                                            {grupo.total} socios
                                        </span>
                                    </div>

                                    {/* TABLA */}
                                    <div className="tabla-container">
                                        <table className="tabla">
                                            <thead>
                                                <tr>
                                                    <th>Socio</th>
                                                    <th>Estado</th>
                                                    <th>Inicio</th>
                                                    <th>Fin</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {grupo.socios.map((socio) => (
                                                    <tr key={socio.id}>
                                                        <td>{socio.nombre}</td>

                                                        <td>
                                                            <span className={`estado ${
                                                                socio.estado === 'activo'
                                                                    ? 'activo'
                                                                    : 'inactivo'
                                                            }`}>
                                                                {socio.estado}
                                                            </span>
                                                        </td>

                                                        <td>{socio.fecha_inicio}</td>
                                                        <td>{socio.fecha_fin}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-card {
                    background: rgba(0,0,0,.55);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 24px;
                    padding: 2rem;
                    backdrop-filter: blur(14px);
                }

                .dashboard-hero-title {
                    font-size: 1.8rem;
                    font-weight: 900;
                    color: white;
                }

                .dashboard-hero-title span {
                    color: #1CE0EB;
                }

                .membresia-group {
                    border-top: 1px solid rgba(255,255,255,.08);
                    padding-top: 1rem;
                }

                .badge-total {
                    font-size: .7rem;
                    padding: .3rem .7rem;
                    border-radius: 999px;
                    background: rgba(255,255,255,.08);
                    color: #aaa;
                }

                .tabla-container {
                    overflow-x: auto;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,.08);
                }

                .tabla {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: .85rem;
                    color: white;
                }

                .tabla thead {
                    background: rgba(255,255,255,.05);
                }

                .tabla th {
                    text-align: left;
                    padding: .8rem;
                    font-size: .7rem;
                    text-transform: uppercase;
                    color: #aaa;
                }

                .tabla td {
                    padding: .7rem;
                    border-top: 1px solid rgba(255,255,255,.05);
                }

                .tabla tr:hover {
                    background: rgba(255,255,255,.03);
                }

                .estado {
                    font-size: .7rem;
                    padding: .2rem .6rem;
                    border-radius: 999px;
                    font-weight: bold;
                }

                .estado.activo {
                    background: rgba(34,197,94,.2);
                    color: #22c55e;
                }

                .estado.inactivo {
                    background: rgba(239,68,68,.2);
                    color: #ef4444;
                }
            `}</style>
        </AppSidebarLayout>
    );
}