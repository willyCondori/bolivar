import { useCallback, useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

// ─── Estilos ─────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; background: #03060f; font-family: 'Inter', sans-serif; }

.root {
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(28,224,235,.08), transparent 30%),
              radial-gradient(circle at bottom right, rgba(21,163,171,.10), transparent 35%),
              linear-gradient(135deg, #02050d 0%, #061120 55%, #09182b 100%);
  position: relative; overflow: hidden;
}

.canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

.glow {
  position: fixed; border-radius: 50%; pointer-events: none;
  filter: blur(14px); z-index: 1;
}
.glow-tl {
  width: 380px; height: 380px; top: -120px; left: -80px;
  background: radial-gradient(circle, rgba(28,224,235,.10) 0%, transparent 70%);
}
.glow-br {
  width: 320px; height: 320px; right: -60px; bottom: -80px;
  background: radial-gradient(circle, rgba(13,102,107,.14) 0%, transparent 70%);
}

.shell { position: relative; z-index: 5; display: flex; min-height: 100vh; }

.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px); z-index: 29;
  opacity: 0; pointer-events: none; transition: .25s ease;
}
.overlay.show { opacity: 1; pointer-events: auto; }

.sidebar {
  width: 280px; min-width: 280px;
  background: linear-gradient(180deg, rgba(7,17,31,.90), rgba(4,11,20,.94));
  backdrop-filter: blur(18px);
  border-right: 1px solid rgba(255,255,255,.06);
  padding: 1.4rem 1rem;
  display: flex; flex-direction: column;
  position: relative; z-index: 30;
  transition: transform .28s ease;
}

.sidebar-head {
  display: flex; align-items: center; gap: .85rem;
  padding: .4rem .4rem 1.3rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.badge {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #1CE0EB, #0D666B); color: #04121a;
  font-family: 'Bebas Neue', sans-serif; font-size: 1.35rem;
  box-shadow: 0 0 22px rgba(28,224,235,.24);
}

.brand h1 { margin: 0; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: .08em; }
.brand p  { margin: .25rem 0 0; color: rgba(224,247,248,.45); font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; }

.role-pill {
  margin-top: .7rem; display: inline-flex;
  padding: .36rem .75rem; border-radius: 999px;
  border: 1px solid rgba(28,224,235,.16); background: rgba(28,224,235,.08);
  color: #bafcff; font-size: .72rem; letter-spacing: .08em;
  text-transform: uppercase; font-weight: 700;
}

nav { padding-top: 1.2rem; display: grid; gap: .45rem; }

.nav-link {
  display: flex; align-items: center; gap: .85rem;
  padding: .9rem 1rem; border-radius: 16px;
  color: rgba(224,247,248,.68); text-decoration: none;
  transition: .2s ease; border: 1px solid transparent;
}
.nav-link:hover { background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.05); color: #fff; }
.nav-link.active { background: rgba(28,224,235,.10); border-color: rgba(28,224,235,.16); color: #bafcff; }
.nav-link svg { width: 19px; height: 19px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

.sidebar-foot { margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,.06); }

.user-card { padding: 1rem; border-radius: 18px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); }
.user-name  { color: #fff; font-size: .95rem; font-weight: 600; }
.user-email { margin-top: .25rem; color: rgba(224,247,248,.45); font-size: .8rem; word-break: break-word; }

.logout {
  width: 100%; margin-top: .9rem; height: 46px; border: none;
  border-radius: 14px; background: linear-gradient(135deg, #1CE0EB, #15A3AB);
  color: #031019; font-weight: 800; letter-spacing: .06em;
  text-transform: uppercase; cursor: pointer;
}

.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

.topbar {
  height: 78px; display: flex; align-items: center;
  justify-content: space-between; gap: 1rem; padding: 0 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
  background: rgba(6,15,27,.35); backdrop-filter: blur(12px);
}

.menu-btn {
  width: 44px; height: 44px; border: 1px solid rgba(255,255,255,.07);
  background: rgba(255,255,255,.04); color: #d5fdff; border-radius: 14px;
  display: none; align-items: center; justify-content: center; cursor: pointer;
}
.menu-btn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.page-title    { color: #fff; font-size: 1.25rem; font-weight: 700; }
.page-subtitle { color: rgba(224,247,248,.45); font-size: .84rem; margin-top: .15rem; }

.content { padding: 1.5rem; opacity: 0; transform: translateY(18px); transition: .8s ease; }
.content.visible { opacity: 1; transform: translateY(0); }

@media (max-width: 980px) {
  .menu-btn { display: inline-flex; }
  .sidebar  { position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
}
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = {
  dashboard:   <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/></svg>,
  registro:    <svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 8a4 4 0 1 0-8 0v0M8 12v0a4 4 0 0 0 8 0v0"/></svg>,
  socios:      <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/></svg>,
  membresias:  <svg viewBox="0 0 24 24"><path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>,
  accesos:     <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>,
  reportes:    <svg viewBox="0 0 24 24"><path d="M4 19h16M4 15h10M4 11h16M4 7h6"/></svg>,
  bloqueos:    <svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>,
  config:      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 .6 1.6 1.6 0 0 0-.33 1.82"/><path d="M4.6 9a1.6 1.6 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.6 1.6 0 0 0 9 4.6c.39-.23.67-.61.76-1.04V3.5a2 2 0 1 1 4 0v.06c.09.43.37.81.76 1.04a1.6 1.6 0 0 0 1.9-.24l.06-.06A2 2 0 1 1 19.8 7.1l-.06.06A1.6 1.6 0 0 0 19.4 9c.23.39.61.67 1.04.76h.06a2 2 0 1 1 0 4h-.06c-.43.09-.81.37-1.04.76"/><path d="M9 19.4a1.6 1.6 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.3 16.96l.06-.06A1.6 1.6 0 0 0 4.6 15c-.23-.39-.61-.67-1.04-.76H3.5a2 2 0 1 1 0-4h.06c.43-.09.81-.37 1.04-.76"/></svg>,
  validar:     <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>,
  plus:        <svg viewBox="0 0 24 24"><path d="M3 12h18M12 3v18"/></svg>,
  alerta:      <svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
  buscar:      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>,
  carnet:      <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h5M7 13h3M16 10h.01M16 14h.01"/></svg>,
  historial:   <svg viewBox="0 0 24 24"><path d="M12 8v4l3 3M3.05 11A9 9 0 1 1 6 17.3M3 4v5h5"/></svg>,
  perfil:      <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>,
};

// ─── Nav por rol ──────────────────────────────────────────────────────────────
const active = (name) => { try { return route().current(name); } catch { return false; } };
const r      = (name) => { try { return route(name); } catch { return '#'; } };

const NAV = {
  Administrador: () => [
    { label: 'Dashboard',         href: r('dashboard'),           active: active('dashboard'),            icon: I.dashboard  },
    { label: 'Registrar Ingresos',href: r('reconocimiento.index'),active: active('reconocimiento.index'), icon: I.registro   },
    { label: 'Socios',            href: r('socios.index'),         active: active('socios.index'),         icon: I.socios     },
    { label: 'Membresías',        href: r('accesos.membresias'),   active: active('accesos.membresias'),   icon: I.membresias },
    { label: 'Reportes',          href: r('reportes.ingresos'),    active: active('reporte.ingresos'),     icon: I.reportes   },
  ],
  Operador: () => [
    { label: 'Dashboard',         href: r('dashboard'),            active: active('dashboard'),            icon: I.dashboard },
    { label: 'Validar ingreso',   href: '#',                       active: false,                          icon: I.validar   },
    { label: 'Accesos del día',   href: '#',                       active: false,                          icon: I.plus      },
    { label: 'Incidencias',       href: '#',                       active: false,                          icon: I.alerta    },
    { label: 'Consulta de socio', href: '#',                       active: false,                          icon: I.buscar    },
    { label: 'Registrar Ingresos',href: r('reconocimiento.index'), active: active('reconocimiento.index'), icon: I.registro  },
  ],
  Socio: () => [
    { label: 'Mi panel',            href: r('dashboard'), active: active('dashboard'), icon: I.dashboard  },
    { label: 'Mi membresía',        href: '#',            active: false,               icon: I.membresias },
    { label: 'Carnet digital',      href: '#',            active: false,               icon: I.carnet     },
    { label: 'Historial de accesos',href: '#',            active: false,               icon: I.historial  },
    { label: 'Mis datos',           href: '#',            active: false,               icon: I.perfil     },
  ],
};

// ─── Hook: partículas ─────────────────────────────────────────────────────────
function useParticles(ref) {
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;

        const pts = Array.from({ length: 65 }, () => ({
            x: Math.random() * innerWidth,  y: Math.random() * innerHeight,
            r: Math.random() * 1.8 + 0.4,  dx: (Math.random() - .5) * .20,
            dy: (Math.random() - .5) * .20, o: Math.random() * .35 + .08,
        }));

        const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pts.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(28,224,235,${p.o})`;
                ctx.fill();
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
}

// ─── Inyector de CSS (una sola vez) ──────────────────────────────────────────
let injected = false;
const injectCSS = () => {
    if (injected) return;
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AppSidebarLayout({ title = 'Panel', children }) {
    const { auth }            = usePage().props;
    const [open, setOpen]     = useState(false);
    const [ready, setReady]   = useState(false);
    const canvasRef           = useRef(null);

    injectCSS();
    useParticles(canvasRef);

    useEffect(() => { const t = setTimeout(() => setReady(true), 120); return () => clearTimeout(t); }, []);

    const logout = useCallback(() => router.post(route('logout')), []);
    const close  = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(v => !v), []);

    const role  = auth?.user?.role?.nombre ?? 'Administrador';
    const items = (NAV[role] ?? NAV.Administrador)();

    return (
        <>
            <Head title={title} />
            <div className="root">
                <canvas ref={canvasRef} className="canvas" />
                <div className="glow glow-tl" />
                <div className="glow glow-br" />

                <div className={`overlay${open ? ' show' : ''}`} onClick={close} />

                <div className="shell">
                    {/* Sidebar */}
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
                            {items.map(({ label, href, active: isActive, icon }) => (
                                <Link key={label} href={href} className={`nav-link${isActive ? ' active' : ''}`} onClick={close}>
                                    {icon}
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="sidebar-foot">
                            <div className="user-card">
                                <div className="user-name">{auth?.user?.name}</div>
                                <div className="user-email">{auth?.user?.email}</div>
                                <button className="logout" type="button" onClick={logout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="main">
                        <header className="topbar">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button className="menu-btn" type="button" aria-label="Abrir menú" onClick={toggle}>
                                    <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
                                </button>
                                <div>
                                    <div className="page-title">{title}</div>
                                    <div className="page-subtitle">Panel interno del sistema</div>
                                </div>
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