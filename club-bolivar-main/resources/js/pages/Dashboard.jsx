import { Link, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

// ── datos por rol ─────────────────────────────────────────────────────────────
const ROLES = {
    Administrador: {
        title: ['Panel de', 'Administración General'],
        text: 'Desde aquí el administrador podrá gestionar socios, membresías, accesos, reportes, bloqueos y configuración general del sistema.',
        stats: [
            { num:'Socios',   label:'Gestión completa',      cta:'Registrar nuevo socio →', href:'socios.create' },
            { num:'Accesos',  label:'Control y seguimiento',  cta:'Reconocimiento facial →', href:'reconocimiento.index' },
            { num:'Reportes', label:'Ingresos del sistema',   cta:'Ver reporte de ingresos →', href:'reportes.ingresos' },
        ],
        actions: [
            { title:'Lo que hará este rol',  text:'Ver todos los módulos, aprobar procesos, supervisar operaciones y administrar la configuración general.' },
            { title:'Próximos módulos',      text:'Registro de socios, gestión de membresías, reportes, bloqueos y seguridad.' },
        ],
    },
    Operador: {
        title: ['Panel de', 'Operación de Accesos'],
        text: 'Valida ingresos mediante reconocimiento facial o código QR, revisa incidencias y realiza consultas rápidas del socio.',
        stats: [
            { num:'Facial', label:'Reconocimiento biométrico', cta:'Iniciar reconocimiento →', href:'accesos.facial' },
            { num:'QR',     label:'Control operativo',         cta:'Escanear código QR →',    href:'accesos.qr' },
            { num:'Soporte',label:'Incidencias del día',       cta:null },
        ],
        actions: [
            { title:'Lo que hará este rol', text:'Validar accesos, registrar entradas y salidas, y atender incidencias en sitio.' },
            { title:'Enfoque del operador', text:'Interfaz simple, rápida y enfocada en la operación del estadio.' },
        ],
    },
    Socio: {
        title: ['Bienvenido a', 'Tu Panel de Socio'],
        text: 'Desde aquí podrás revisar tu membresía, descargar tu carnet digital, actualizar tus datos personales y consultar tu historial de accesos.',
        stats: [
            { num:'Carnet',   label:'Disponible en línea',   cta:'Ver mi carnet →', href:'socio.panel' },
            { num:'Perfil',   label:'Datos actualizables',   cta:'Editar perfil →', href:'profile.edit' },
            { num:'Historial',label:'Consulta personal',     cta:null },
        ],
        actions: [
            { title:'Lo que hará este rol',   text:'Gestionar su propia información, ver su membresía y descargar su carnet.' },
            { title:'Experiencia del socio',  text:'Un panel simple, claro y centrado solo en lo que realmente necesita.' },
        ],
    },
};

// ── sub-componentes ───────────────────────────────────────────────────────────
const Stat = ({ num, label, cta, href }) => {
    const inner = (
        <>
            <div className="dashboard-stat-num">{num}</div>
            <div className="dashboard-stat-label">{label}</div>
            {cta && <div className="dashboard-stat-cta">{cta}</div>}
        </>
    );
    return href
        ? <Link href={route(href)} className="dashboard-stat dashboard-stat-link">{inner}</Link>
        : <div className="dashboard-stat">{inner}</div>;
};

// ── component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const { auth } = usePage().props;
    const roleName = auth?.user?.role?.nombre ?? 'Administrador';
    const cfg = ROLES[roleName] ?? ROLES.Administrador;

    return (
        <AppSidebarLayout title="Dashboard">
            <style>{`
                .dashboard-grid { display:grid; grid-template-columns:1.2fr .8fr; gap:1.5rem; }
                .dashboard-card { border:1px solid rgba(255,255,255,.07); background:linear-gradient(180deg,rgba(10,20,35,.82),rgba(5,11,22,.92)); backdrop-filter:blur(18px); border-radius:28px; box-shadow:0 20px 60px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.04); padding:1.6rem; position:relative; overflow:hidden; }
                .dashboard-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(28,224,235,.05),transparent 45%); pointer-events:none; }
                .dashboard-card > * { position:relative; z-index:1; }
                .dashboard-hero-title { margin:0; font-size:clamp(1.8rem,4vw,2.7rem); font-weight:800; line-height:1.1; color:#fff; }
                .dashboard-hero-title span { display:block; background:linear-gradient(135deg,#1CE0EB,#9bf8ff,#15A3AB); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
                .dashboard-hero-text { margin-top:1rem; max-width:700px; color:rgba(224,247,248,.58); line-height:1.8; font-size:.98rem; }
                .dashboard-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; margin-top:1.5rem; }
                .dashboard-stat { padding:1rem; border-radius:18px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); }
                .dashboard-stat-link { display:block; text-decoration:none; transition:transform .15s,border-color .15s,background .15s; cursor:pointer; }
                .dashboard-stat-link:hover { transform:translateY(-2px); background:rgba(28,224,235,.06); border-color:rgba(28,224,235,.18); }
                .dashboard-stat-num { color:#1CE0EB; font-size:1.35rem; font-weight:800; line-height:1.1; }
                .dashboard-stat-label { margin-top:.4rem; color:rgba(224,247,248,.45); font-size:.8rem; text-transform:uppercase; letter-spacing:.08em; }
                .dashboard-stat-cta { margin-top:.65rem; color:rgba(224,247,248,.58); font-size:.82rem; font-weight:650; letter-spacing:.02em; }
                .dashboard-actions { display:grid; gap:1rem; }
                .dashboard-action-title { color:#fff; font-size:1rem; font-weight:700; margin-bottom:.55rem; }
                .dashboard-action-text { color:rgba(224,247,248,.52); line-height:1.7; font-size:.9rem; }
                @media (max-width:1024px) { .dashboard-grid { grid-template-columns:1fr; } }
                @media (max-width:640px)  { .dashboard-stats { grid-template-columns:1fr; } }
            `}</style>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        {cfg.title[0]}
                        <span>{cfg.title[1]}</span>
                    </h1>
                    <p className="dashboard-hero-text">{cfg.text}</p>
                    <div className="dashboard-stats">
                        {cfg.stats.map(s => <Stat key={s.num} {...s} />)}
                    </div>
                </div>

                <div className="dashboard-actions">
                    {cfg.actions.map(a => (
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