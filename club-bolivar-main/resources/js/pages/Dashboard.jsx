import { Link, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

const ROLES = {
    admin: {
        title: ['Panel de', 'Administración General'],
        text: 'Desde aquí el administrador podrá gestionar socios, membresías, accesos, reportes, bloqueos y configuración general del sistema.',
        stats: [
            { num: 'Socios', label: 'Gestión completa', cta: 'Registrar nuevo socio →', href: 'socios.create' },
            { num: 'Accesos', label: 'Control y seguimiento', cta: 'Reconocimiento facial →', href: 'reconocimiento.index' },
            { num: 'Reportes', label: 'Ingresos de accesos', cta: 'Ver reporte de accesos →', href: 'reportes.ingresos' },
        ],
        actions: [
            { title: 'Lo que hará este rol', text: 'Ver todos los módulos, aprobar procesos y administrar el sistema.' },
            { title: 'Próximos módulos', text: 'Socios, membresías, reportes y seguridad.' },
        ],
    },
    operador: {
        title: ['Panel de', 'Operación de Accesos'],
        text: 'Valida ingresos mediante QR o reconocimiento facial.',
        stats: [
            { num: 'Facial', label: 'Biometría', cta: 'Iniciar →', href: 'accesos.facial' },
            { num: 'QR', label: 'Control operativo', cta: 'Escanear →', href: 'accesos.qr' },
            { num: 'Soporte', label: 'Incidencias' },
        ],
        actions: [
            { title: 'Rol operador', text: 'Control de accesos en tiempo real.' },
        ],
    },
    socio: {
        title: ['Bienvenido a', 'Tu Panel de Socio'],
        text: 'Consulta tu membresía y accesos.',
        stats: [
            { num: 'Carnet', label: 'Disponible', cta: 'Ver →', href: 'socio.panel' },
            { num: 'Perfil', label: 'Datos personales', cta: 'Editar →', href: 'profile.edit' },
        ],
        actions: [
            { title: 'Tu acceso', text: 'Gestión personal del socio.' },
        ],
    },
};

const Stat = ({ num, label, cta, href }) => {
    const content = (
        <>
            <div className="dashboard-stat-num">{num}</div>
            <div className="dashboard-stat-label">{label}</div>
            {cta && <div className="dashboard-stat-cta">{cta}</div>}
        </>
    );

    return href ? (
        <Link href={route(href)} className="dashboard-stat dashboard-stat-link">
            {content}
        </Link>
    ) : (
        <div className="dashboard-stat">{content}</div>
    );
};

export default function Dashboard() {
    const { auth } = usePage().props;

    // ✔️ FIX PRINCIPAL
    const role = auth?.user?.role?.nombre ?? 'admin';

    // fallback seguro
    const cfg = ROLES[role] ?? ROLES.admin;

    return (
        <AppSidebarLayout title="Dashboard">
            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        {cfg.title[0]}
                        <span>{cfg.title[1]}</span>
                    </h1>

                    <p className="dashboard-hero-text">{cfg.text}</p>

                    <div className="dashboard-stats">
                        {cfg.stats.map((s) => (
                            <Stat key={s.num} {...s} />
                        ))}
                    </div>
                </div>

                <div className="dashboard-actions">
                    {cfg.actions.map((a) => (
                        <div key={a.title} className="dashboard-card">
                            <div className="dashboard-action-title">{a.title}</div>
                            <div className="dashboard-action-text">{a.text}</div>
                        </div>
                    ))}
                </div>

            </div>
        </AppSidebarLayout>
    );
}