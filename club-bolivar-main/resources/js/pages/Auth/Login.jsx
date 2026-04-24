import { useEffect, useRef, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPass, setShowPass] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const canvasRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        setTimeout(() => setLoaded(true), 120);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let raf;
        const particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 70; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.8 + 0.4,
                dx: (Math.random() - 0.5) * 0.25,
                dy: (Math.random() - 0.5) * 0.25,
                o: Math.random() * 0.45 + 0.08,
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
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login — Club Bolívar" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 0;
                    background: #03060f;
                    font-family: 'Inter', sans-serif;
                }

                .login-root {
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(circle at top left, rgba(28,224,235,0.08), transparent 32%),
                        radial-gradient(circle at bottom right, rgba(21,163,171,0.10), transparent 34%),
                        linear-gradient(135deg, #02050d 0%, #061120 55%, #09182b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .login-canvas {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .login-glow-1,
                .login-glow-2,
                .login-glow-3 {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    filter: blur(12px);
                    z-index: 1;
                }

                .login-glow-1 {
                    width: 420px;
                    height: 420px;
                    top: -120px;
                    left: -100px;
                    background: radial-gradient(circle, rgba(28,224,235,0.11) 0%, transparent 70%);
                    animation: glowFloat 8s ease-in-out infinite;
                }

                .login-glow-2 {
                    width: 360px;
                    height: 360px;
                    bottom: -100px;
                    right: -60px;
                    background: radial-gradient(circle, rgba(13,102,107,0.14) 0%, transparent 70%);
                    animation: glowFloat 10s ease-in-out infinite reverse;
                }

                .login-glow-3 {
                    width: 260px;
                    height: 260px;
                    top: 50%;
                    left: 8%;
                    background: radial-gradient(circle, rgba(30,236,247,0.08) 0%, transparent 75%);
                    animation: glowPulse 6s ease-in-out infinite;
                }

                @keyframes glowFloat {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
                    50% { transform: translateY(20px) scale(1.08); opacity: .75; }
                }

                @keyframes glowPulse {
                    0%, 100% { transform: scale(1); opacity: .7; }
                    50% { transform: scale(1.18); opacity: .45; }
                }

                .login-shell {
                    position: relative;
                    z-index: 5;
                    width: 100%;
                    max-width: 1180px;
                    display: grid;
                    grid-template-columns: 1.05fr .95fr;
                    align-items: stretch;
                    gap: 2rem;
                }

                .login-side {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 2rem 1rem 2rem 0;
                    opacity: 0;
                    transform: translateY(24px);
                    transition: all .8s ease;
                }

                .login-side.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .login-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: .55rem;
                    width: fit-content;
                    padding: .5rem 1rem;
                    border: 1px solid rgba(28,224,235,0.22);
                    background: rgba(28,224,235,0.06);
                    color: #7eeef4;
                    border-radius: 999px;
                    font-size: .76rem;
                    font-weight: 600;
                    letter-spacing: .11em;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                }

                .login-badge-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #1CE0EB;
                    box-shadow: 0 0 12px rgba(28,224,235,.8);
                }

                .login-title {
                    margin: 0;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3.2rem, 8vw, 6.2rem);
                    line-height: .92;
                    letter-spacing: .03em;
                    color: #fff;
                }

                .login-title span {
                    display: block;
                    background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 22px rgba(28,224,235,.32));
                }

                .login-text {
                    margin-top: 1.1rem;
                    max-width: 540px;
                    font-size: 1rem;
                    line-height: 1.8;
                    color: rgba(224,247,248,0.58);
                }

                .login-mini-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .login-mini-card {
                    min-width: 145px;
                    padding: 1rem 1rem .95rem;
                    border: 1px solid rgba(255,255,255,.06);
                    background: rgba(255,255,255,.03);
                    backdrop-filter: blur(14px);
                    border-radius: 18px;
                    box-shadow: 0 12px 32px rgba(0,0,0,.18);
                }

                .login-mini-num {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 2rem;
                    line-height: 1;
                    color: #1CE0EB;
                    letter-spacing: .05em;
                }

                .login-mini-label {
                    margin-top: .35rem;
                    font-size: .73rem;
                    color: rgba(224,247,248,0.45);
                    letter-spacing: .09em;
                    text-transform: uppercase;
                }

                .login-card-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: translateY(24px);
                    transition: all .8s ease .12s;
                }

                .login-card-wrap.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .login-card {
                    width: 100%;
                    max-width: 460px;
                    border: 1px solid rgba(255,255,255,.07);
                    background: linear-gradient(180deg, rgba(10,20,35,.82), rgba(5,11,22,.92));
                    backdrop-filter: blur(18px);
                    border-radius: 28px;
                    box-shadow:
                        0 20px 60px rgba(0,0,0,.38),
                        inset 0 1px 0 rgba(255,255,255,.04);
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .login-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(28,224,235,.06), transparent 45%);
                    pointer-events: none;
                }

                .login-card-header {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 1.6rem;
                }

                .login-brand {
                    display: flex;
                    align-items: center;
                    gap: .9rem;
                    margin-bottom: 1rem;
                }

                .login-brand-badge {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1CE0EB, #0D666B);
                    color: #021018;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.4rem;
                    box-shadow: 0 0 22px rgba(28,224,235,.28);
                }

                .login-brand-text h1 {
                    margin: 0;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.8rem;
                    color: #fff;
                    letter-spacing: .08em;
                    line-height: 1;
                }

                .login-brand-text p {
                    margin: .25rem 0 0 0;
                    color: rgba(224,247,248,.48);
                    font-size: .83rem;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                }

                .login-heading {
                    margin: 0;
                    font-size: 1.45rem;
                    font-weight: 700;
                    color: #fff;
                }

                .login-subheading {
                    margin: .45rem 0 0;
                    font-size: .92rem;
                    line-height: 1.65;
                    color: rgba(224,247,248,.56);
                }

                .login-status {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 1rem;
                    padding: .95rem 1rem;
                    border-radius: 14px;
                    border: 1px solid rgba(28,224,235,.2);
                    background: rgba(28,224,235,.08);
                    color: #a6fbff;
                    font-size: .88rem;
                }

                .login-form {
                    position: relative;
                    z-index: 1;
                }

                .input-group {
                    margin-bottom: 1rem;
                }

                .input-label {
                    display: block;
                    margin-bottom: .5rem;
                    font-size: .82rem;
                    font-weight: 600;
                    color: rgba(224,247,248,.82);
                    letter-spacing: .03em;
                }

                .input-shell {
                    position: relative;
                }

                .input-shell input {
                    width: 100%;
                    height: 56px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,.08);
                    background: rgba(255,255,255,.04);
                    color: #fff;
                    padding: 0 1rem;
                    outline: none;
                    font-size: .95rem;
                    transition: all .2s ease;
                }

                .input-shell input::placeholder {
                    color: rgba(224,247,248,.30);
                }

                .input-shell input:focus {
                    border-color: rgba(28,224,235,.48);
                    box-shadow: 0 0 0 4px rgba(28,224,235,.10);
                    background: rgba(255,255,255,.05);
                }

                .password-shell input {
                    padding-right: 3.4rem;
                }

                .pass-toggle {
                    position: absolute;
                    top: 50%;
                    right: .65rem;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 12px;
                    background: rgba(255,255,255,.05);
                    color: #9deef2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all .2s ease;
                }

                .pass-toggle:hover {
                    background: rgba(28,224,235,.12);
                }

                .pass-toggle svg {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                }

                .error {
                    display: block;
                    margin-top: .45rem;
                    font-size: .8rem;
                    color: #ff8e8e;
                }

                .login-options {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    margin: 1.1rem 0 1.4rem;
                    flex-wrap: wrap;
                }

                .remember-label {
                    display: inline-flex;
                    align-items: center;
                    gap: .6rem;
                    font-size: .88rem;
                    color: rgba(224,247,248,.68);
                    cursor: pointer;
                    user-select: none;
                }

                .remember-label input {
                    width: 16px;
                    height: 16px;
                    accent-color: #1CE0EB;
                }

                .forgot-link {
                    color: #7eeef4;
                    text-decoration: none;
                    font-size: .88rem;
                    font-weight: 500;
                    transition: opacity .2s ease;
                }

                .forgot-link:hover {
                    opacity: .85;
                }

                .login-btn {
                    width: 100%;
                    height: 56px;
                    border: none;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #031019;
                    font-size: .94rem;
                    font-weight: 800;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all .22s ease;
                    box-shadow: 0 12px 28px rgba(28,224,235,.22);
                }

                .login-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 16px 34px rgba(28,224,235,.28);
                }

                .login-btn:disabled {
                    opacity: .72;
                    cursor: not-allowed;
                    transform: none;
                }

                .login-bottom {
                    margin-top: 1.35rem;
                    text-align: center;
                    font-size: .88rem;
                    color: rgba(224,247,248,.48);
                }

                .login-bottom a {
                    color: #7eeef4;
                    text-decoration: none;
                    font-weight: 600;
                }

                .login-back {
                    display: inline-flex;
                    align-items: center;
                    gap: .55rem;
                    margin-top: 1.4rem;
                    color: rgba(224,247,248,.52);
                    text-decoration: none;
                    font-size: .86rem;
                    transition: color .2s ease;
                }

                .login-back:hover {
                    color: #b6fbff;
                }

                @media (max-width: 960px) {
                    .login-shell {
                        grid-template-columns: 1fr;
                    }

                    .login-side {
                        padding: 0;
                        text-align: center;
                        align-items: center;
                    }

                    .login-text {
                        max-width: 650px;
                    }

                    .login-mini-stats {
                        justify-content: center;
                    }
                }

                @media (max-width: 640px) {
                    .login-root {
                        padding: 1rem;
                    }

                    .login-card {
                        padding: 1.4rem;
                        border-radius: 22px;
                    }

                    .login-heading {
                        font-size: 1.2rem;
                    }

                    .login-options {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .login-title {
                        font-size: 3rem;
                    }
                }
            `}</style>

            <div className="login-root">
                <canvas ref={canvasRef} className="login-canvas" />
                <div className="login-glow-1" />
                <div className="login-glow-2" />
                <div className="login-glow-3" />

                <div className="login-shell">
                    <section className={`login-side ${loaded ? 'visible' : ''}`}>
                        <div className="login-badge">
                            <span className="login-badge-dot" />
                            Acceso seguro
                        </div>

                        <h2 className="login-title">
                            Ingresa al
                            <span>Club Bolívar</span>
                        </h2>

                        <p className="login-text">
                            Administra accesos, membresías y validaciones desde una interfaz
                            moderna, segura y diseñada para el sistema de control del estadio.
                        </p>

                        <div className="login-mini-stats">
                            <div className="login-mini-card">
                                <div className="login-mini-num">24/7</div>
                                <div className="login-mini-label">Disponibilidad</div>
                            </div>
                            <div className="login-mini-card">
                                <div className="login-mini-num">QR</div>
                                <div className="login-mini-label">Verificación</div>
                            </div>
                            <div className="login-mini-card">
                                <div className="login-mini-num">IA</div>
                                <div className="login-mini-label">Reconocimiento</div>
                            </div>
                        </div>

                        <Link href={route('home')} className="login-back">
                            ← Volver al inicio
                        </Link>
                    </section>

                    <section className={`login-card-wrap ${loaded ? 'visible' : ''}`}>
                        <div className="login-card">
                            <div className="login-card-header">
                                <div className="login-brand">
                                    <div className="login-brand-badge">B</div>
                                    <div className="login-brand-text">
                                        <h1>Club Bolívar</h1>
                                        <p>Sistema de acceso</p>
                                    </div>
                                </div>

                                <h3 className="login-heading">Iniciar sesión</h3>
                                <p className="login-subheading">
                                    Ingresa con tus credenciales para acceder al panel del sistema.
                                </p>
                            </div>

                            {status && <div className="login-status">{status}</div>}

                            <form onSubmit={submit} className="login-form">
                                <div className="input-group">
                                    <label className="input-label">Correo electrónico</label>
                                    <div className="input-shell">
                                        <input
                                            type="email"
                                            placeholder="email@gmail.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                        />
                                    </div>
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Contraseña</label>
                                    <div className="input-shell password-shell">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Ingresa tu contraseña"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            autoComplete="current-password"
                                        />

                                        <button
                                            type="button"
                                            className="pass-toggle"
                                            onClick={() => setShowPass(!showPass)}
                                            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.password && <span className="error">{errors.password}</span>}
                                </div>

                                <div className="login-options">
                                    <label className="remember-label">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        Recordarme
                                    </label>

                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="forgot-link">
                                            Olvidé mi contraseña
                                        </Link>
                                    )}
                                </div>

                                <button type="submit" className="login-btn" disabled={processing}>
                                    {processing ? 'Ingresando...' : 'Ingresar'}
                                </button>

                                <div className="login-bottom">
                                    ¿Aún no tienes acceso?{' '}
                                    <Link href={route('register')}>
                                        Regístrate
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}