import { Link, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

export default function Dashboard() {
    const { auth } = usePage().props;
    const role = auth?.user?.role?.nombre ?? 'Administrador';

    const renderAdmin = () => (
        <>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        Panel de
                        <span>Administración General</span>
                    </h1>

                    <p className="dashboard-hero-text">
                        Desde aquí el administrador podrá gestionar socios, membresías, accesos,
                        reportes, bloqueos y configuración general del sistema. También será el
                        punto central para alertas y monitoreo de seguridad.
                    </p>

                    <div className="dashboard-stats">
                        <Link
                            href={route('socios.create')}
                            className="dashboard-stat dashboard-stat-link"
                        >
                            <div className="dashboard-stat-num">Socios</div>
                            <div className="dashboard-stat-label">Gestión completa</div>
                            <div className="dashboard-stat-cta">Registrar nuevo socio →</div>
                        </Link>
                        <Link
                            href={route('reconocimiento.index')}
                            className="dashboard-stat dashboard-stat-link"
                        >
                            <div className="dashboard-stat-num">Accesos</div>
                            <div className="dashboard-stat-label">Control y seguimiento</div>
                            <div className="dashboard-stat-cta">Reconocimiento facial →</div>
                        </Link>
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">Reportes</div>
                            <div className="dashboard-stat-label">Visión del sistema</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <div className="dashboard-card dashboard-action">
                        <div className="dashboard-action-title">Lo que hará este rol</div>
                        <div className="dashboard-action-text">
                            Ver todos los módulos, aprobar procesos, supervisar operaciones y administrar
                            la configuración general.
                        </div>
                    </div>
                    <div className="dashboard-card dashboard-action">
                        <div className="dashboard-action-title">Próximos módulos</div>
                        <div className="dashboard-action-text">
                            Registro de socios, gestión de membresías, reportes, bloqueos y seguridad.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderOperador = () => (
        <>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        Panel de
                        <span>Operación de Accesos</span>
                    </h1>

                    <p className="dashboard-hero-text">
                        Este panel está orientado al trabajo en los puntos de control del estadio.
                        Aquí el operador validará ingresos mediante reconocimiento facial o código QR,
                        revisará incidencias y realizará consultas rápidas del socio.
                    </p>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">Ingreso</div>
                            <div className="dashboard-stat-label">Validación rápida</div>
                        </div>
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">QR</div>
                            <div className="dashboard-stat-label">Control operativo</div>
                        </div>
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">Soporte</div>
                            <div className="dashboard-stat-label">Incidencias del día</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <div className="dashboard-card dashboard-action">
                        <div className="dashboard-action-title">Lo que hará este rol</div>
                        <div className="dashboard-action-text">
                            Validar accesos, registrar entradas y salidas, y atender incidencias en sitio.
                        </div>
                    </div>
                    <div className="dashboard-card dashboard-action">
                        <div className="dashboard-action-title">Enfoque del operador</div>
                        <div className="dashboard-action-text">
                            Interfaz simple, rápida y enfocada en la operación del estadio.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderSocio = () => (
        <>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        Bienvenido a
                        <span>Tu Panel de Socio</span>
                    </h1>

                    <p className="dashboard-hero-text">
                        Desde aquí el socio podrá revisar su membresía, descargar su carnet digital,
                        actualizar sus datos personales y consultar su historial de accesos.
                    </p>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">Carnet</div>
                            <div className="dashboard-stat-label">Disponible en línea</div>
                        </div>
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">Perfil</div>
                            <div className="dashboard-stat-label">Datos actualizables</div>
                        </div>
                        <div className="dashboard-stat">
                            <div className="dashboard-stat-num">Historial</div>
                            <div className="dashboard-stat-label">Consulta personal</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <div className="dashboard-card dashboard-action">
                        <div className="dashboard-action-title">Lo que hará este rol</div>
                        <div className="dashboard-action-text">
                            Gestionar su propia información, ver su membresía y descargar su carnet.
                        </div>
                    </div>
                    <div className="dashboard-card dashboard-action">
                        <div className="dashboard-action-title">Experiencia del socio</div>
                        <div className="dashboard-action-text">
                            Un panel simple, claro y centrado solo en lo que realmente necesita.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <AppSidebarLayout title="Dashboard">
            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1.2fr .8fr;
                    gap: 1.5rem;
                }

                .dashboard-card {
                    border: 1px solid rgba(255,255,255,.07);
                    background: linear-gradient(180deg, rgba(10,20,35,.82), rgba(5,11,22,.92));
                    backdrop-filter: blur(18px);
                    border-radius: 28px;
                    box-shadow:
                        0 20px 60px rgba(0,0,0,.25),
                        inset 0 1px 0 rgba(255,255,255,.04);
                    padding: 1.6rem;
                    position: relative;
                    overflow: hidden;
                }

                .dashboard-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(28,224,235,.05), transparent 45%);
                    pointer-events: none;
                }

                .dashboard-card > * {
                    position: relative;
                    z-index: 1;
                }

                .dashboard-hero-title {
                    margin: 0;
                    font-size: clamp(1.8rem, 4vw, 2.7rem);
                    font-weight: 800;
                    line-height: 1.1;
                    color: #fff;
                }

                .dashboard-hero-title span {
                    display: block;
                    background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .dashboard-hero-text {
                    margin-top: 1rem;
                    max-width: 700px;
                    color: rgba(224,247,248,.58);
                    line-height: 1.8;
                    font-size: .98rem;
                }

                .dashboard-stats {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .dashboard-stat {
                    padding: 1rem;
                    border-radius: 18px;
                    background: rgba(255,255,255,.03);
                    border: 1px solid rgba(255,255,255,.06);
                }

                .dashboard-stat-link {
                    display: block;
                    text-decoration: none;
                    transition: transform .15s ease, border-color .15s ease, background .15s ease;
                    cursor: pointer;
                }

                .dashboard-stat-link:hover {
                    transform: translateY(-2px);
                    background: rgba(28,224,235,.06);
                    border-color: rgba(28,224,235,.18);
                }

                .dashboard-stat-cta {
                    margin-top: .65rem;
                    color: rgba(224,247,248,.58);
                    font-size: .82rem;
                    font-weight: 650;
                    letter-spacing: .02em;
                }

                .dashboard-stat-num {
                    color: #1CE0EB;
                    font-size: 1.35rem;
                    font-weight: 800;
                    line-height: 1.1;
                }

                .dashboard-stat-label {
                    margin-top: .4rem;
                    color: rgba(224,247,248,.45);
                    font-size: .8rem;
                    text-transform: uppercase;
                    letter-spacing: .08em;
                }

                .dashboard-actions {
                    display: grid;
                    gap: 1rem;
                }

                .dashboard-action-title {
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 700;
                    margin-bottom: .55rem;
                }

                .dashboard-action-text {
                    color: rgba(224,247,248,.52);
                    line-height: 1.7;
                    font-size: .9rem;
                }

                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .dashboard-stats {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {role === 'Operador'
                ? renderOperador()
                : role === 'Socio'
                ? renderSocio()
                : renderAdmin()}
        </AppSidebarLayout>
    );
}