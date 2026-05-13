import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { getSidebarNavigation } from '@/config/sidebarNavigation.jsx';
import SidebarNavItem from '@/components/layout/SidebarNavItem';

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
        requestAnimationFrame(() => {
            setReady(true);
        });
    }, []);

    const logout = useCallback(() => router.post(route('logout')), []);
    const toggle = useCallback(() => setOpen(v => !v), []);
    const close = useCallback(() => setOpen(false), []);

    const role = auth?.user?.role?.nombre ?? 'admin';

    /* ─────────────────────────────────────────────
       NAV OPTIMIZADO (SIN DUPLICACIÓN)
    ───────────────────────────────────────────── */
    const currentRoute = useMemo(() => route().current(), []);
    const items = getSidebarNavigation(role, currentRoute);

    /* ───────────────────────────────────────────── */
    return (
        <>
            <Head title={title} />

            <div className="root">
                {/* <canvas ref={canvasRef} className="canvas" /> */}
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
                                <SidebarNavItem
                                    key={label}
                                    label={label}
                                    href={href}
                                    active={active}
                                    icon={icon}
                                    onClick={close}
                                />
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