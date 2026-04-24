import { Link, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';


export default function SociosIndex({ socios }) {
    const { auth, filtroEstado } = usePage().props;
    const [search, setSearch] = useState('');

    return (
        <AppSidebarLayout title="Gestión de Socios">
            <style>{`
                .socios-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .glass-card {
                    border: 1px solid rgba(255,255,255,.07);
                    background: linear-gradient(180deg, rgba(10,20,35,.82), rgba(5,11,22,.92));
                    backdrop-filter: blur(18px);
                    border-radius: 28px;
                    box-shadow: 0 20px 60px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04);
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .glass-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(28,224,235,.05), transparent 45%);
                    pointer-events: none;
                }

                .table-header-title {
                    margin: 0 0 1.5rem 0;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #fff;
                }

                .table-header-title span {
                    background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .custom-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 0.8rem;
                }

                .custom-table th {
                    padding: 1rem;
                    text-align: left;
                    color: rgba(224,247,248,.45);
                    font-size: .8rem;
                    text-transform: uppercase;
                    letter-spacing: .08em;
                    font-weight: 700;
                }

                .table-row {
                    background: rgba(255,255,255,.03);
                    transition: all .2s ease;
                }

                .table-row:hover {
                    background: rgba(28,224,235,.06);
                    transform: scale(1.005);
                }

                .custom-table td {
                    padding: 1.2rem 1rem;
                    color: rgba(224,247,248,.8);
                    border-top: 1px solid rgba(255,255,255,.05);
                    border-bottom: 1px solid rgba(255,255,255,.05);
                }

                .custom-table td:first-child {
                    border-left: 1px solid rgba(255,255,255,.05);
                    border-top-left-radius: 15px;
                    border-bottom-left-radius: 15px;
                }

                .custom-table td:last-child {
                    border-right: 1px solid rgba(255,255,255,.05);
                    border-top-right-radius: 15px;
                    border-bottom-right-radius: 15px;
                }

                .socio-avatar {
                    height: 45px;
                    width: 45px;
                    border-radius: 12px;
                    object-cover: cover;
                    border: 2px solid rgba(28,224,235,.3);
                }

                .badge {
                    padding: 0.4rem 0.8rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .badge-active {
                    background: rgba(28, 224, 235, 0.15);
                    color: #1CE0EB;
                    border: 1px solid rgba(28, 224, 235, 0.3);
                }

                .text-main { color: #fff; font-weight: 600; }
                .text-sub { color: rgba(224,247,248,.45); font-size: 0.85rem; }

                .btn-add {
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #050b16;
                    padding: 0.8rem 1.5rem;
                    border-radius: 14px;
                    font-weight: 800;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: opacity 0.2s;
                }

                .btn-add:hover { opacity: 0.9; }
            `}</style>

            <div className="socios-container">
                <div className="flex justify-between items-center px-4">
                    <h1 className="table-header-title">
                        Listado de <span>Socios Registrados</span>
                    </h1>
                    <Link href={route('socios.create')} className="btn-add">
                        <span>+</span> Nuevo Socio
                    </Link>
                </div>
                <div className="flex gap-3 px-4">
                    <Link
                        href={route('socios.index', { estado: 'Activo' })}
                        className={`btn-add ${filtroEstado === 'Activo' ? 'opacity-100' : 'opacity-60'}`}
                    >
                        Activos
                    </Link>

                    <Link
                        href={route('socios.index', { estado: 'Inactivo' })}
                        className={`btn-add ${filtroEstado === 'Inactivo' ? 'opacity-100' : 'opacity-60'}`}
                    >
                        Inactivos
                    </Link>

                    <Link
                        href={route('socios.index', { estado: 'Todos' })}
                        className={`btn-add ${filtroEstado === 'Todos' ? 'opacity-100' : 'opacity-60'}`}
                    >
                        Todos
                    </Link>
                </div>
                <div className="glass-card">
                    <div className="overflow-x-auto">
                        <div className="px-4">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o CI..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#1CE0EB]"
                            />
                        </div>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Perfil</th>
                                    <th>Datos Personales</th>
                                    <th>Identificación</th>
                                    <th>Número de telefono</th>
                                    <th>Membresía</th>
                                    <th>Estado</th>
                                    <th>Ingreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {socios
                                    .filter((socio) =>
                                        `${socio.nombres} ${socio.apellidos}`
                                            .toLowerCase()
                                            .includes(search.toLowerCase()) ||
                                        socio.ci?.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((socio) => (
                                    <tr key={socio.id} className="table-row">
                                        <td>
                                            <img 
                                                src={socio.foto_path ? `/storage/${socio.foto_path}` : '/img/default-avatar.png'} 
                                                alt="Avatar" 
                                                className="socio-avatar"
                                            />
                                        </td>
                                        <td>
                                            <div className="text-main">{socio.nombres} {socio.apellidos}</div>
                                            <div className="text-sub">{socio.email || 'Sin correo'}</div>
                                        </td>
                                        <td>
                                            <div className="text-main">{socio.ci}</div>
                                            <div className="text-sub">Documento ID</div>
                                        </td>
                                        <td>
                                            <div className="text-main">{socio.telefono}</div>
                                            <div className="text-sub">Documento ID</div>
                                        </td>
                                        <td>
                                            <div className="text-main" style={{color: '#1CE0EB'}}>{socio.tipo_membresia}</div>
                                            <div className="text-sub">Plan Actual</div>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    socio.estado === 'Activo'
                                                        ? 'badge-active'
                                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                }`}
                                            >
                                                {socio.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-main">{new Date(socio.fecha_ingreso).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <Link 
                                                href={route('socios.edit', socio.id)} 
                                                className="text-main hover:text-[#1CE0EB] transition-colors mr-3"
                                            >
                                                Editar
                                            </Link>

                                            {socio.estado === 'Activo' ? (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('¿Seguro que deseas desactivar este socio?')) {
                                                            router.delete(route('socios.destroy', socio.id));
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-600 transition"
                                                >
                                                    Eliminar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('¿Deseas reactivar este socio?')) {
                                                            router.patch(route('socios.restore', socio.id));
                                                        }
                                                    }}
                                                    className="text-green-400 hover:text-green-500 transition"
                                                >
                                                    Recuperar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}