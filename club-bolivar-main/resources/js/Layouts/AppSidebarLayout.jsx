import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

/* ─────────────────────────────────────────────
   ICONOS (asume que ya existen en tu archivo)
──────────────────────────────────────────── */
const I = {
    dashboard: <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/></svg>,
    registro: <svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 8a4 4 0 1 0-8 0v0M8 12v0a4 4 0 0 0 8 0v0"/></svg>,
    socios: <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/></svg>,
    membresias: <svg viewBox="0 0 24 24"><path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>,
    reportes: <svg viewBox="0 0 24 24"><path d="M4 19h16M4 15h10M4 11h16M4 7h6"/></svg>,
    alerta: <svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
    perfil: <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>,
};

/* ─────────────────────────────────────────────
   PARTICULAS OPTIMIZADO
──────────────────────────────────────────── */
function useParticles(ref) {
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let raf;

        const pts = Array.from({ length: 50 }, () => ({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            r: Math.random() * 1.5 + 0.4,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
            o: Math.random() * 0.3 + 0.1,
        }));

        const resize = () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of pts) {
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
            cancelAnimationFrame(raf);
            raf = null;
            window.removeEventListener('resize', resize);
        };
    }, []);
}

/* ─────────────────────────────────────────────
   LAYOUT PRINCIPAL
──────────────────────────────────────────── */
export default function AppSidebarLayout({ title = 'Panel', children }) {
    const { auth } = usePage().props;

    const [open, setOpen] = useState(false);
    const [ready, setReady] = useState(false);
    const canvasRef = useRef(null);

    //useParticles(canvasRef);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(t);
    }, []);

    const logout = useCallback(() => router.post(route('logout')), []);
    const toggle = useCallback(() => setOpen(v => !v), []);
    const close = useCallback(() => setOpen(false), []);

    const role = auth?.user?.role?.nombre ?? 'admin';

    /* ─────────────────────────────────────────────
       NAV OPTIMIZADO (SIN DUPLICACIÓN)
    ───────────────────────────────────────────── */
    const items = useMemo(() => {
        const current = route().current();

        const r = (name) => {
            try { return route(name); }
            catch { return '#'; }
        };

        const NAV = {
            admin: [
                { label: 'Dashboard', href: r('dashboard'), active: current === 'dashboard', icon: I.dashboard },
                { label: 'Registrar Ingresos', href: r('reconocimiento.index'), active: current === 'reconocimiento.index', icon: I.registro },
                { label: 'Socios', href: r('socios.index'), active: current === 'socios.index', icon: I.socios },
                { label: 'Membresías', href: r('accesos.membresias'), active: current === 'accesos.membresias', icon: I.membresias },
                { label: 'Reportes', href: r('reportes.ingresos'), active: current === 'reportes.ingresos', icon: I.reportes },
                { label: 'Notificaciones', href: r('notificacion.index'), active: current === 'notificacion.index', icon: I.alerta },
                { label: 'Usuarios', href: r('users.create'), active: current === 'users.create', icon: I.perfil },
            ],
            operador: [
                { label: 'Dashboard', href: r('dashboard'), active: current === 'dashboard', icon: I.dashboard },
                { label: 'Notificaciones', href: r('notificacion.index'), active: current === 'notificacion.index', icon: I.alerta },
                { label: 'Registrar Ingresos', href: r('reconocimiento.index'), active: current === 'reconocimiento.index', icon: I.registro },
            ],
            socio: [
                { label: 'Mi panel', href: r('dashboard'), active: current === 'dashboard', icon: I.dashboard },
            ],
        };

        return NAV[role] ?? NAV.admin;
    }, [role]);

    /* ───────────────────────────────────────────── */
    return (
        <>
            <Head title={title} />

            <div className="root">
                <canvas ref={canvasRef} className="canvas" />
                <div className="glow glow-tl" />
                <div className="glow glow-br" />

                <div className={`overlay${open ? ' show' : ''}`} onClick={close} />

                <div className="shell">

                    {/* ───── SIDEBAR ───── */}
                    <aside className={`sidebar${open ? ' open' : ''}`}>
                        <div className="sidebar-head">
                            <div className="badge">B</div>
                            <div className="brand">
                                <h1>Club Bolívar</h1>
                                <p>Sistema de acceso</p>
                                <div className="role-pill">{role}</div>
                            </div>
                        </div>

                        <nav>
                            {items.map(({ label, href, active, icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`nav-link${active ? ' active' : ''}`}
                                    onClick={close}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="sidebar-foot">
                            <div className="user-card">
                                <div className="user-name">{auth?.user?.name}</div>
                                <div className="user-email">{auth?.user?.email}</div>

                                <button
                                    className="logout"
                                    type="button"
                                    onClick={logout}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ───── MAIN ───── */}
                    <main className="main">
                        <header className="topbar">
                            <button className="menu-btn" onClick={toggle}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                </svg>
                            </button>

                            <div>
                                <div className="page-title">{title}</div>
                                <div className="page-subtitle">Panel interno del sistema</div>
                            </div>
                        </header>

                        <section className={`content${ready ? ' visible' : ''}`}>
                            {children}
                        </section>
                    </main>

                </div>
            </div>
        </>
    );
}