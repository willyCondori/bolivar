import React from 'react';

export default function TablaAuditLogs({ logs }) {
    if (!logs.length) return (
        <div className="tabla-vacia">No hay registros aún.</div>
    );

    return (
        <div className="tabla-contenedor">
            <table className="tabla">
                <thead>
                    <tr>
                        <th>Acción</th>
                        <th>Tabla</th>
                        <th>Fecha y hora</th>
                        <th>IP</th>
                        <th>Navegador</th>
                        <th>Sistema operativo</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td>
                                <span className={`badge badge-${log.accion}`}>
                                    {log.accion}
                                </span>
                            </td>
                            <td>{log.modelo_afectado}</td>
                            <td className="td-muted">{log.fecha_hora ?? '—'}</td>
                            <td className="td-muted">{log.ip_address}</td>
                            <td>{log.navegador ?? '—'}</td>
                            <td>{log.sistema_operativo ?? '—'}</td>
                            <td className="td-muted">{log.user_id ?? 'Sin sesión'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}