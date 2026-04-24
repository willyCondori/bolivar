import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({ auth }) {
    const canvasRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.5 + 0.3,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                o: Math.random() * 0.5 + 0.1,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(28,224,235,${p.o})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <>
            <Head title="Club Bolívar — Sistema de Control de Acceso" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600&display=swap');

                * { margin:0; padding:0; box-sizing:border-box; }

                .wl-root {
                    min-height: 100vh;
                    background: #03060f;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                .wl-canvas {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .wl-glow-1 {
                    position: fixed;
                    width: 600px; height: 600px;
                    top: -200px; left: -200px;
                    background: radial-gradient(circle, rgba(28,224,235,0.06) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: glowPulse 6s ease-in-out infinite;
                }
                .wl-glow-2 {
                    position: fixed;
                    width: 500px; height: 500px;
                    bottom: -100px; right: -100px;
                    background: radial-gradient(circle, rgba(13,102,107,0.08) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: glowPulse 8s ease-in-out infinite reverse;
                }
                @keyframes glowPulse {
                    0%,100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.6; }
                }

               .wl-bg-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
        radial-gradient(circle at 20% 30%, rgba(28,224,235,0.08), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(21,163,171,0.08), transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(28,224,235,0.03), transparent 60%);
    z-index: 1;
}

                .wl-nav {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem 3rem;
                    border-bottom: 1px solid rgba(28,224,235,0.08);
                }

                .wl-nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .wl-nav-escudo {
                    width: 42px; height: 42px;
                    background: linear-gradient(135deg, #1CE0EB, #0D666B);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.1rem;
                    color: #03060f;
                    box-shadow: 0 0 20px rgba(28,224,235,0.3);
                }

                .wl-nav-nombre {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.3rem;
                    letter-spacing: 0.1em;
                    color: #ffffff;
                }

                .wl-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .wl-btn-outline {
                    border: 1px solid rgba(28,224,235,0.3);
                    color: #1CE0EB;
                    background: transparent;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all .2s;
                    letter-spacing: 0.04em;
                }
                .wl-btn-outline:hover {
                    background: rgba(28,224,235,0.08);
                    border-color: #1CE0EB;
                    box-shadow: 0 0 16px rgba(28,224,235,0.2);
                }

                .wl-btn-solid {
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #03060f;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all .2s;
                    letter-spacing: 0.04em;
                }
                .wl-btn-solid:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(28,224,235,0.35);
                }

                .wl-hero {
                    position: relative;
                    z-index: 10;
                    min-height: calc(100vh - 80px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 4rem 2rem 2rem;
                }

                .wl-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid rgba(28,224,235,0.25);
                    background: rgba(28,224,235,0.06);
                    color: #1CE0EB;
                    padding: 6px 16px;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all .6s ease;
                }
                .wl-badge.visible { opacity: 1; transform: translateY(0); }

                .wl-badge-dot {
                    width: 6px; height: 6px;
                    background: #1CE0EB;
                    border-radius: 50%;
                    animation: dotPulse 1.5s ease-in-out infinite;
                }
                @keyframes dotPulse {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.6); }
                }

                .wl-titulo {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(4rem, 12vw, 9rem);
                    line-height: 0.9;
                    letter-spacing: 0.02em;
                    color: #ffffff;
                    margin-bottom: 1rem;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all .8s ease .1s;
                }
                .wl-titulo.visible { opacity: 1; transform: translateY(0); }

                .wl-titulo-acento {
                    display: block;
                    background: linear-gradient(135deg, #1CE0EB, #1EECF7, #15A3AB);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 30px rgba(28,224,235,0.4));
                }

                .wl-subtitulo {
                    font-size: clamp(0.9rem, 2vw, 1.1rem);
                    color: rgba(224,247,248,0.55);
                    max-width: 520px;
                    line-height: 1.7;
                    margin-bottom: 2.5rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all .8s ease .2s;
                }
                .wl-subtitulo.visible { opacity: 1; transform: translateY(0); }

                .wl-ctas {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin-bottom: 4rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all .8s ease .3s;
                }
                .wl-ctas.visible { opacity: 1; transform: translateY(0); }

                .wl-cta-primary {
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #03060f;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    text-decoration: none;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    transition: all .2s;
                    position: relative;
                    overflow: hidden;
                }
                .wl-cta-primary::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transform: translateX(-100%);
                    transition: transform .5s;
                }
                .wl-cta-primary:hover::after { transform: translateX(100%); }
                .wl-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(28,224,235,0.4); }

                .wl-cta-secondary {
                    border: 1px solid rgba(28,224,235,0.3);
                    color: #1CE0EB;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-decoration: none;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    transition: all .2s;
                    background: transparent;
                }
                .wl-cta-secondary:hover {
                    background: rgba(28,224,235,0.06);
                    border-color: #1CE0EB;
                    box-shadow: 0 0 20px rgba(28,224,235,0.15);
                }

                .wl-stats {
                    display: flex;
                    gap: 3rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    opacity: 0;
                    transition: all .8s ease .4s;
                }
                .wl-stats.visible { opacity: 1; }

                .wl-stat {
                    text-align: center;
                }
                .wl-stat-num {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 2.5rem;
                    color: #1CE0EB;
                    line-height: 1;
                    letter-spacing: 0.05em;
                }
                .wl-stat-label {
                    font-size: 0.72rem;
                    color: rgba(224,247,248,0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-top: 4px;
                }

                .wl-features {
                    position: relative;
                    z-index: 10;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 1px;
                    background: rgba(28,224,235,0.06);
                    border-top: 1px solid rgba(28,224,235,0.08);
                    border-bottom: 1px solid rgba(28,224,235,0.08);
                }

                .wl-feature {
                    padding: 2.5rem 2rem;
                    background: #03060f;
                    transition: background .2s;
                }
                .wl-feature:hover { background: rgba(28,224,235,0.03); }

                .wl-feature-icon {
                    width: 44px; height: 44px;
                    border: 1px solid rgba(28,224,235,0.2);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    background: rgba(28,224,235,0.05);
                }

                .wl-feature-titulo {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.1rem;
                    letter-spacing: 0.08em;
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                }

                .wl-feature-desc {
                    font-size: 0.82rem;
                    color: rgba(224,247,248,0.45);
                    line-height: 1.6;
                }

                .wl-footer {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    padding: 2rem;
                    color: rgba(224,247,248,0.2);
                    font-size: 0.75rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                @media (max-width: 640px) {
                    .wl-nav { padding: 1rem 1.5rem; }
                    .wl-nav-nombre { font-size: 1rem; }
                    .wl-stats { gap: 1.5rem; }
                }
            `}</style>

            <div className="wl-root">
                <canvas ref={canvasRef} className="wl-canvas" />
                <div className="wl-glow-1" />
                <div className="wl-glow-2" />
                <div className="wl-bg-overlay" />

                <nav className="wl-nav">
                    <div className="wl-nav-logo">
                        <div className="wl-nav-escudo">B</div>
                        <span className="wl-nav-nombre">Club Bolívar</span>
                    </div>
                    <div className="wl-nav-links">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="wl-btn-solid">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="wl-btn-outline">
                                    Ingresar
                                </Link>
                                <Link href={route('register')} className="wl-btn-solid">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <section className="wl-hero">
                    <div className={`wl-badge ${loaded ? 'visible' : ''}`}>
                        <span className="wl-badge-dot" />
                        Sistema de Control de Acceso
                    </div>

                    <h1 className={`wl-titulo ${loaded ? 'visible' : ''}`}>
                        Bienvenido al
                        <span className="wl-titulo-acento">Club Bolívar</span>
                    </h1>

                    <p className={`wl-subtitulo ${loaded ? 'visible' : ''}`}>
                        Únete a la familia celeste. Gestiona tu membresía, accede al estadio
                        y sé parte del club más grande de Bolivia.
                    </p>

                    <div className={`wl-ctas ${loaded ? 'visible' : ''}`}>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="wl-cta-primary">
                                Ir al panel
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')} className="wl-cta-primary">
                                    Únete ahora
                                </Link>
                                <Link href={route('login')} className="wl-cta-secondary">
                                    Ya soy socio
                                </Link>
                            </>
                        )}
                    </div>

                    <div className={`wl-stats ${loaded ? 'visible' : ''}`}>
                        {[
                            { num: '50K+', label: 'Socios activos' },
                            { num: '1948', label: 'Año de fundación' },
                            { num: '30+', label: 'Títulos nacionales' },
                            { num: '100%', label: 'Acceso seguro' },
                        ].map(s => (
                            <div key={s.label} className="wl-stat">
                                <div className="wl-stat-num">{s.num}</div>
                                <div className="wl-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="wl-features">
                    {[
                        { icon: '🛡️', titulo: 'Acceso seguro', desc: 'Control de ingreso al estadio mediante reconocimiento facial y código QR.' },
                        { icon: '🪪', titulo: 'Carnet digital', desc: 'Tu credencial de socio siempre disponible en tu dispositivo.' },
                        { icon: '📊', titulo: 'Historial', desc: 'Consulta todos tus ingresos y el estado de tu membresía en tiempo real.' },
                        { icon: '⚡', titulo: 'Renovación fácil', desc: 'Renueva tu membresía en segundos sin colas ni trámites presenciales.' },
                    ].map(f => (
                        <div key={f.titulo} className="wl-feature">
                            <div className="wl-feature-icon">{f.icon}</div>
                            <div className="wl-feature-titulo">{f.titulo}</div>
                            <div className="wl-feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>

                <footer className="wl-footer">
                    Club Bolívar — Sistema de Control de Acceso © 2026
                </footer>
            </div>
        </>
    );
}