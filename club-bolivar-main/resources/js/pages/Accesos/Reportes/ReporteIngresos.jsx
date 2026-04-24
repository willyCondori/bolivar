import { useEffect, useState } from 'react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

export default function ReporteIngresos() {
    const [data, setData] = useState([]);
    const [fecha, setFecha] = useState('');
    const [tipo, setTipo] = useState('todos');

    const fetchData = async () => {
        try {
            let url = `/api/reportes/ingresos?fecha=${fecha}&tipo=${tipo}`;

            const res = await fetch(url);
            const json = await res.json();

            // 🔥 UNIFICAR DATOS
            let accesos = (json.accesos || []).map(a => ({
                fecha: a.created_at,
                nombre: a.socio
                    ? `${a.socio.nombres} ${a.socio.apellidos}`
                    : 'Desconocido',
                tipo: a.tipo,
                estado: 'correcto'
            }));

            let fallidos = (json.fallidos || []).map(f => ({
                fecha: f.created_at,
                nombre: f.socio
                    ? `${f.socio.nombres} ${f.socio.apellidos}`
                    : 'Desconocido',
                tipo: 'fallido',
                estado: 'fallido'
            }));

            let combinado = [...accesos, ...fallidos];

            // 🔥 FILTRO POR TIPO (frontend)
            if (tipo === 'entrada' || tipo === 'salida') {
                combinado = combinado.filter(item => item.tipo === tipo);
            }

            if (tipo === 'fallido') {
                combinado = combinado.filter(item => item.estado === 'fallido');
            }

            setData(combinado);

        } catch (error) {
            console.error('Error cargando reporte:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppSidebarLayout title="Reporte de Ingresos">

            <div className="max-w-7xl mx-auto p-6 text-white">

                <h1 className="text-2xl font-bold mb-6">
                    Reporte de Ingresos
                </h1>

                {/* 🔎 FILTROS */}
                <div className="flex gap-4 mb-6">

                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="bg-black/40 border p-2 rounded"
                    />

                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="bg-black/40 border p-2 rounded"
                    >
                        <option value="todos">Todos</option>
                        <option value="entrada">Entradas</option>
                        <option value="salida">Salidas</option>
                        <option value="fallido">Fallidos</option>
                    </select>

                    <button
                        onClick={fetchData}
                        className="bg-cyan-500 px-4 py-2 rounded"
                    >
                        Filtrar
                    </button>
                </div>

                {/* 📊 TABLA */}
                <div className="overflow-auto border border-white/10 rounded-xl">

                    <table className="w-full text-sm">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="p-3 text-left">Fecha</th>
                                <th className="p-3 text-left">Nombre</th>
                                <th className="p-3 text-left">Tipo</th>
                                <th className="p-3 text-left">Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-400">
                                        Sin registros
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, i) => (
                                    <tr key={i} className="border-t border-white/10">

                                        <td className="p-3">
                                            {item.fecha
                                                ? new Date(item.fecha).toLocaleString()
                                                : '-'}
                                        </td>

                                        <td className="p-3">
                                            {item.nombre}
                                        </td>

                                        <td className="p-3">
                                            {item.tipo}
                                        </td>

                                        <td className="p-3">
                                            {item.estado === 'fallido' ? (
                                                <span className="text-red-400 font-bold">
                                                    Fallido
                                                </span>
                                            ) : (
                                                <span className="text-green-400 font-bold">
                                                    Correcto
                                                </span>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>

            </div>

        </AppSidebarLayout>
    );
}