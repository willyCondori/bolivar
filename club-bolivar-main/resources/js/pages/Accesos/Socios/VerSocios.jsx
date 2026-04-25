import { Link, usePage, router } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { useState, useMemo } from 'react';

export default function SociosIndex({ socios }) {
    const { filtroEstado } = usePage().props;
    const [search, setSearch] = useState('');

    const searchLower = search.toLowerCase();

    // 🔎 Filtrado optimizado
    const sociosFiltrados = useMemo(() => {
        return socios.filter((s) => {
            const nombre = `${s.nombres} ${s.apellidos}`.toLowerCase();
            const ci = s.ci?.toLowerCase() || '';
            return nombre.includes(searchLower) || ci.includes(searchLower);
        });
    }, [searchLower, socios]);

    // ⚡ Acciones reutilizables
    const handleDelete = (id) => {
        if (confirm('¿Seguro que deseas desactivar este socio?')) {
            router.delete(route('socios.destroy', id));
        }
    };

    const handleRestore = (id) => {
        if (confirm('¿Deseas reactivar este socio?')) {
            router.patch(route('socios.restore', id));
        }
    };

    // 🎯 Botón filtro reutilizable
    const FiltroBtn = ({ estado, label }) => (
        <Link
            href={route('socios.index', { estado })}
            className={`btn-add ${filtroEstado === estado ? 'opacity-100' : 'opacity-60'}`}
        >
            {label}
        </Link>
    );

    return (
        <AppSidebarLayout title="Gestión de Socios">
            <style>{/* 🔥 MISMO CSS (no se toca diseño) */`
                .socios-container { display: flex; flex-direction: column; gap: 1.5rem; }
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
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(28,224,235,.05), transparent 45%);
                }
                .table-header-title {
                    margin-bottom: 1.5rem; font-size: 1.8rem; font-weight: 800; color: #fff;
                }
                .table-header-title span {
                    background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .custom-table { width: 100%; border-spacing: 0 0.8rem; }
                .custom-table th {
                    padding: 1rem; color: rgba(224,247,248,.45);
                    font-size: .8rem; text-transform: uppercase;
                }
                .table-row { background: rgba(255,255,255,.03); transition: .2s; }
                .table-row:hover { background: rgba(28,224,235,.06); transform: scale(1.005); }
                .custom-table td {
                    padding: 1.2rem 1rem;
                    color: rgba(224,247,248,.8);
                }
                .socio-avatar {
                    height: 45px; width: 45px; border-radius: 12px;
                    border: 2px solid rgba(28,224,235,.3);
                }
                .badge {
                    padding: 0.4rem 0.8rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .badge-active {
                    background: rgba(28,224,235,.15);
                    color: #1CE0EB;
                }
                .text-main { color: #fff; font-weight: 600; }
                .text-sub { color: rgba(224,247,248,.45); font-size: 0.85rem; }
                .btn-add {
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #050b16;
                    padding: 0.8rem 1.5rem;
                    border-radius: 14px;
                    font-weight: 800;
                    display: inline-flex;
                    gap: 0.5rem;
                }
            `}</style>

            <div className="socios-container">
                {/* Header */}
                <div className="flex justify-between items-center px-4">
                    <h1 className="table-header-title">
                        Listado de <span>Socios Registrados</span>
                    </h1>
                    <Link href={route('socios.create')} className="btn-add">
                        + Nuevo Socio
                    </Link>
                </div>

                {/* Filtros */}
                <div className="flex gap-3 px-4">
                    <FiltroBtn estado="Activo" label="Activos" />
                    <FiltroBtn estado="Inactivo" label="Inactivos" />
                    <FiltroBtn estado="Todos" label="Todos" />
                </div>

                {/* Tabla */}
                <div className="glass-card">
                    <div className="px-4 mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o CI..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                        />
                    </div>

                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Perfil</th>
                                <th>Datos</th>
                                <th>CI</th>
                                <th>Teléfono</th>
                                <th>Membresía</th>
                                <th>Estado</th>
                                <th>Ingreso</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {sociosFiltrados.map((s) => (
                                <tr key={s.id} className="table-row">
                                    <td>
                                        <img
                                            src={s.foto_path ? `/storage/${s.foto_path}` : '/img/default-avatar.png'}
                                            className="socio-avatar"
                                        />
                                    </td>

                                    <td>
                                        <div className="text-main">{s.nombres} {s.apellidos}</div>
                                        <div className="text-sub">{s.email || 'Sin correo'}</div>
                                    </td>

                                    <td className="text-main">{s.ci}</td>
                                    <td className="text-main">{s.telefono}</td>

                                    <td>
                                        <div className="text-main text-[#1CE0EB]">{s.tipo_membresia}</div>
                                    </td>

                                    <td>
                                        <span className={`badge ${s.estado === 'Activo'
                                            ? 'badge-active'
                                            : 'bg-red-500/20 text-red-300'}`}>
                                            {s.estado}
                                        </span>
                                    </td>

                                    <td className="text-main">
                                        {new Date(s.fecha_ingreso).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <Link
                                            href={route('socios.edit', s.id)}
                                            className="text-main hover:text-[#1CE0EB] mr-3"
                                        >
                                            Editar
                                        </Link>

                                        {s.estado === 'Activo' ? (
                                            <button onClick={() => handleDelete(s.id)} className="text-red-400">
                                                Eliminar
                                            </button>
                                        ) : (
                                            <button onClick={() => handleRestore(s.id)} className="text-green-400">
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
        </AppSidebarLayout>
    );
}