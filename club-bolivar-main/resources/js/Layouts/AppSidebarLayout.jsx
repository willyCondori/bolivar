import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function AppSidebarLayout({ title = 'Panel', children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 120);

        const canvas = canvasRef.current;
        if (!canvas) return () => clearTimeout(timer);

        const ctx = canvas.getContext('2d');
        let raf;
        const particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 65; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.8 + 0.4,
                dx: (Math.random() - 0.5) * 0.20,
                dy: (Math.random() - 0.5) * 0.20,
                o: Math.random() * 0.35 + 0.08,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(28,224,235,${p.o})`;
                ctx.fill();

                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }

            raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const cerrarSesion = () => {
        router.post(route('logout'));
    };

    const role = auth?.user?.role?.nombre ?? 'Administrador';

    const isActive = (name) => route().current(name);

    const navItems = useMemo(() => {
        if (role === 'Administrador' || role === 'SuperAdmin') {
            return [
                {
                    label: 'Dashboard',
                    href: route('dashboard'),
                    active: isActive('dashboard'),
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" />
                        </svg>
                    ),
                },
                // --- Reconociento ---
                {
                    label: 'Reconocimiento Facial',
                    href: route('reconocimiento.index'), // Asegúrate que este nombre de ruta coincida con tu Web.php
                    active: isActive('reconocimiento.index'),
                    svg: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            <path d="M16 8a4 4 0 1 0-8 0v0" />
                            <path d="M8 12v0a4 4 0 0 0 8 0v0" />
                        </svg>
                    ),
                },
                {
                    label: 'Socios',
                    href: route('socios.index'),
                    active: isActive('socios.index'),
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                            <circle cx="9.5" cy="7" r="4" />
                        </svg>
                    ),
                },
                {
                    label: 'Membresías',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                        </svg>
                    ),
                },
                {
                    label: 'Accesos',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <path d="M10 17l5-5-5-5" />
                            <path d="M15 12H3" />
                        </svg>
                    ),
                },
                {
                    label: 'Reportes',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M4 19h16M4 15h10M4 11h16M4 7h6" />
                        </svg>
                    ),
                },
                {
                    label: 'Bloqueos',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <rect x="4" y="11" width="16" height="9" rx="2" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                    ),
                },
                {
                    label: 'Configuración',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 .6 1.6 1.6 0 0 0-.33 1.82" />
                            <path d="M4.6 9a1.6 1.6 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.6 1.6 0 0 0 9 4.6c.39-.23.67-.61.76-1.04V3.5a2 2 0 1 1 4 0v.06c.09.43.37.81.76 1.04a1.6 1.6 0 0 0 1.9-.24l.06-.06A2 2 0 1 1 19.8 7.1l-.06.06A1.6 1.6 0 0 0 19.4 9c.23.39.61.67 1.04.76h.06a2 2 0 1 1 0 4h-.06c-.43.09-.81.37-1.04.76" />
                            <path d="M9 19.4a1.6 1.6 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.3 16.96l.06-.06A1.6 1.6 0 0 0 4.6 15c-.23-.39-.61-.67-1.04-.76H3.5a2 2 0 1 1 0-4h.06c.43-.09.81-.37 1.04-.76" />
                        </svg>
                    ),
                },
            ];
        }

        if (role === 'Operador') {
            return [
                {
                    label: 'Dashboard',
                    href: route('dashboard'),
                    active: isActive('dashboard'),
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" />
                        </svg>
                    ),
                },
                {
                    label: 'Validar ingreso',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4" />
                            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                        </svg>
                    ),
                },
                {
                    label: 'Accesos del día',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M3 12h18" />
                            <path d="M12 3v18" />
                        </svg>
                    ),
                },
                {
                    label: 'Incidencias',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        </svg>
                    ),
                },
                {
                    label: 'Consulta de socio',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    ),
                },
                {
                    label: 'Reconocimiento Facial',
                    href: route('reconocimiento.index'),
                    active: isActive('reconocimiento.index'),
                    svg: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    ),
                },
            ];
        }

        if (role === 'Socio') {
            return [
                {
                    label: 'Mi panel',
                    href: route('dashboard'),
                    active: isActive('dashboard'),
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" />
                        </svg>
                    ),
                },
                {
                    label: 'Mi membresía',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="6" width="18" height="12" rx="2" />
                            <path d="M8 6V4M16 6V4" />
                        </svg>
                    ),
                },
                {
                    label: 'Carnet digital',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="M7 9h5M7 13h3M16 10h.01M16 14h.01" />
                        </svg>
                    ),
                },
                {
                    label: 'Historial de accesos',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3" />
                            <path d="M3.05 11A9 9 0 1 1 6 17.3" />
                            <path d="M3 4v5h5" />
                        </svg>
                    ),
                },
                {
                    label: 'Mis datos',
                    href: '#',
                    active: false,
                    svg: (
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20a8 8 0 0 1 16 0" />
                        </svg>
                    ),
                },
            ];
        }

        return [
            {
                label: 'Dashboard',
                href: route('dashboard'),
                active: isActive('dashboard'),
                svg: (
                    <svg viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" />
                    </svg>
                ),
            },
        ];
    }, [role]);

    return (
        <>
            <Head title={title} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

                * { box-sizing: border-box; }

                body {
                    margin: 0;
                    padding: 0;
                    background: #03060f;
                    font-family: 'Inter', sans-serif;
                }

                .app-root {
                    min-height: 100vh;
                    background:
                        radial-gradient(circle at top left, rgba(28,224,235,0.08), transparent 30%),
                        radial-gradient(circle at bottom right, rgba(21,163,171,0.10), transparent 35%),
                        linear-gradient(135deg, #02050d 0%, #061120 55%, #09182b 100%);
                    position: relative;
                    overflow: hidden;
                }

                .app-canvas {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .app-glow-1,
                .app-glow-2 {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    filter: blur(14px);
                    z-index: 1;
                }

                .app-glow-1 {
                    width: 380px;
                    height: 380px;
                    top: -120px;
                    left: -80px;
                    background: radial-gradient(circle, rgba(28,224,235,0.10) 0%, transparent 70%);
                }

                .app-glow-2 {
                    width: 320px;
                    height: 320px;
                    right: -60px;
                    bottom: -80px;
                    background: radial-gradient(circle, rgba(13,102,107,0.14) 0%, transparent 70%);
                }

                .app-shell {
                    position: relative;
                    z-index: 5;
                    display: flex;
                    min-height: 100vh;
                }

                .app-sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,.45);
                    backdrop-filter: blur(4px);
                    z-index: 29;
                    opacity: 0;
                    pointer-events: none;
                    transition: .25s ease;
                }

                .app-sidebar-overlay.show {
                    opacity: 1;
                    pointer-events: auto;
                }

                .app-sidebar {
                    width: 280px;
                    min-width: 280px;
                    background: linear-gradient(180deg, rgba(7,17,31,.90), rgba(4,11,20,.94));
                    backdrop-filter: blur(18px);
                    border-right: 1px solid rgba(255,255,255,.06);
                    padding: 1.4rem 1rem;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 30;
                    transition: transform .28s ease;
                }

                .app-sidebar-header {
                    display: flex;
                    align-items: center;
                    gap: .85rem;
                    padding: .4rem .4rem 1.3rem;
                    border-bottom: 1px solid rgba(255,255,255,.06);
                }

                .app-brand-badge {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1CE0EB, #0D666B);
                    color: #04121a;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.35rem;
                    box-shadow: 0 0 22px rgba(28,224,235,.24);
                    flex-shrink: 0;
                }

                .app-brand-text h1 {
                    margin: 0;
                    color: #fff;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.5rem;
                    letter-spacing: .08em;
                    line-height: 1;
                }

                .app-brand-text p {
                    margin: .25rem 0 0;
                    color: rgba(224,247,248,.45);
                    font-size: .78rem;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                }

                .app-role-badge {
                    margin-top: .7rem;
                    display: inline-flex;
                    align-items: center;
                    width: fit-content;
                    padding: .36rem .75rem;
                    border-radius: 999px;
                    border: 1px solid rgba(28,224,235,.16);
                    background: rgba(28,224,235,.08);
                    color: #bafcff;
                    font-size: .72rem;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                .app-nav {
                    padding-top: 1.2rem;
                    display: grid;
                    gap: .45rem;
                }

                .app-nav-link {
                    display: flex;
                    align-items: center;
                    gap: .85rem;
                    padding: .9rem 1rem;
                    border-radius: 16px;
                    color: rgba(224,247,248,.68);
                    text-decoration: none;
                    transition: .2s ease;
                    border: 1px solid transparent;
                }

                .app-nav-link:hover {
                    background: rgba(255,255,255,.04);
                    border-color: rgba(255,255,255,.05);
                    color: #fff;
                }

                .app-nav-link.active {
                    background: rgba(28,224,235,.10);
                    border-color: rgba(28,224,235,.16);
                    color: #bafcff;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,.03);
                }

                .app-nav-link svg {
                    width: 19px;
                    height: 19px;
                    stroke: currentColor;
                    fill: none;
                    stroke-width: 1.8;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    flex-shrink: 0;
                }

                .app-sidebar-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255,255,255,.06);
                }

                .app-user-card {
                    padding: 1rem;
                    border-radius: 18px;
                    background: rgba(255,255,255,.03);
                    border: 1px solid rgba(255,255,255,.06);
                }

                .app-user-name {
                    color: #fff;
                    font-size: .95rem;
                    font-weight: 600;
                }

                .app-user-email {
                    margin-top: .25rem;
                    color: rgba(224,247,248,.45);
                    font-size: .8rem;
                    word-break: break-word;
                }

                .app-logout {
                    width: 100%;
                    margin-top: .9rem;
                    height: 46px;
                    border: none;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #031019;
                    font-weight: 800;
                    letter-spacing: .06em;
                    text-transform: uppercase;
                    cursor: pointer;
                }

                .app-main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                }

                .app-topbar {
                    height: 78px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 0 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,.06);
                    background: rgba(6,15,27,.35);
                    backdrop-filter: blur(12px);
                }

                .app-topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .app-menu-btn {
                    width: 44px;
                    height: 44px;
                    border: 1px solid rgba(255,255,255,.07);
                    background: rgba(255,255,255,.04);
                    color: #d5fdff;
                    border-radius: 14px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .app-menu-btn svg {
                    width: 20px;
                    height: 20px;
                    stroke: currentColor;
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .app-page-title {
                    color: #fff;
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                .app-page-subtitle {
                    color: rgba(224,247,248,.45);
                    font-size: .84rem;
                    margin-top: .15rem;
                }

                .app-content {
                    padding: 1.5rem;
                    opacity: 0;
                    transform: translateY(18px);
                    transition: .8s ease;
                }

                .app-content.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                @media (max-width: 980px) {
                    .app-menu-btn {
                        display: inline-flex;
                    }

                    .app-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        transform: translateX(-100%);
                    }

                    .app-sidebar.open {
                        transform: translateX(0);
                    }
                }
            `}</style>

            <div className="app-root">
                <canvas ref={canvasRef} className="app-canvas" />
                <div className="app-glow-1" />
                <div className="app-glow-2" />

                <div
                    className={`app-sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />

                <div className="app-shell">
                    <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
                        <div className="app-sidebar-header">
                            <div className="app-brand-badge">B</div>
                            <div className="app-brand-text">
                                <h1>Club Bolívar</h1>
                                <p>Sistema de acceso</p>
                                <div className="app-role-badge">{role}</div>
                            </div>
                        </div>

                        <nav className="app-nav">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`app-nav-link ${item.active ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.svg}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="app-sidebar-footer">
                            <div className="app-user-card">
                                <div className="app-user-name">{auth?.user?.name}</div>
                                <div className="app-user-email">{auth?.user?.email}</div>
                                <button className="app-logout" onClick={cerrarSesion}>
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </aside>

                    <main className="app-main">
                        <header className="app-topbar">
                            <div className="app-topbar-left">
                                <button
                                    className="app-menu-btn"
                                    type="button"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M4 7h16M4 12h16M4 17h16" />
                                    </svg>
                                </button>

                                <div>
                                    <div className="app-page-title">{title}</div>
                                    <div className="app-page-subtitle">
                                        Panel interno del sistema
                                    </div>
                                </div>
                            </div>
                        </header>

                        <section className={`app-content ${loaded ? 'visible' : ''}`}>
                            {children}
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}