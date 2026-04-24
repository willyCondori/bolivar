import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [showPass, setShowPass] = useState(false);
    const [showPassConfirm, setShowPassConfirm] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const canvasRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

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

        for (let i = 0; i < 75; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 1.8 + 0.4,
                dx: (Math.random() - 0.5) * 0.22,
                dy: (Math.random() - 0.5) * 0.22,
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
            clearTimeout(timer);
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const passwordRules = useMemo(() => {
        const password = data.password || '';

        return [
            {
                key: 'length',
                label: 'Mínimo 8 caracteres',
                valid: password.length >= 8,
            },
            {
                key: 'uppercase',
                label: 'Al menos una letra mayúscula',
                valid: /[A-Z]/.test(password),
            },
            {
                key: 'lowercase',
                label: 'Al menos una letra minúscula',
                valid: /[a-z]/.test(password),
            },
            {
                key: 'number',
                label: 'Al menos un número',
                valid: /[0-9]/.test(password),
            },
            {
                key: 'symbol',
                label: 'Al menos un carácter especial',
                valid: /[^A-Za-z0-9]/.test(password),
            },
        ];
    }, [data.password]);

    const passwordStrength = passwordRules.filter(rule => rule.valid).length;

    const strengthLabel = (() => {
        if (!data.password) return 'Sin definir';
        if (passwordStrength <= 2) return 'Débil';
        if (passwordStrength <= 4) return 'Media';
        return 'Fuerte';
    })();

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registro — Club Bolívar" />

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

                .register-root {
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(circle at top left, rgba(28,224,235,0.09), transparent 30%),
                        radial-gradient(circle at bottom right, rgba(21,163,171,0.12), transparent 36%),
                        linear-gradient(135deg, #02050d 0%, #061120 55%, #09182b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .register-canvas {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .register-glow-1,
                .register-glow-2,
                .register-glow-3 {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    filter: blur(12px);
                    z-index: 1;
                }

                .register-glow-1 {
                    width: 430px;
                    height: 430px;
                    top: -130px;
                    left: -110px;
                    background: radial-gradient(circle, rgba(28,224,235,0.11) 0%, transparent 70%);
                    animation: glowFloat 8s ease-in-out infinite;
                }

                .register-glow-2 {
                    width: 380px;
                    height: 380px;
                    bottom: -120px;
                    right: -70px;
                    background: radial-gradient(circle, rgba(13,102,107,0.14) 0%, transparent 70%);
                    animation: glowFloat 10s ease-in-out infinite reverse;
                }

                .register-glow-3 {
                    width: 280px;
                    height: 280px;
                    top: 48%;
                    left: 10%;
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

                .register-shell {
                    position: relative;
                    z-index: 5;
                    width: 100%;
                    max-width: 1240px;
                    display: grid;
                    grid-template-columns: 1.05fr .95fr;
                    gap: 2rem;
                    align-items: center;
                }

                .register-side {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: all .8s ease;
                    padding-right: 1rem;
                }

                .register-side.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .register-badge {
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

                .register-badge-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #1CE0EB;
                    box-shadow: 0 0 12px rgba(28,224,235,.8);
                }

                .register-title {
                    margin: 0;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(3.1rem, 8vw, 6rem);
                    line-height: .92;
                    letter-spacing: .03em;
                    color: #fff;
                }

                .register-title span {
                    display: block;
                    background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 22px rgba(28,224,235,.32));
                }

                .register-text {
                    margin-top: 1.1rem;
                    max-width: 560px;
                    font-size: 1rem;
                    line-height: 1.8;
                    color: rgba(224,247,248,0.58);
                }

                .register-points {
                    display: grid;
                    gap: .9rem;
                    margin-top: 2rem;
                    max-width: 540px;
                }

                .register-point {
                    display: flex;
                    align-items: flex-start;
                    gap: .85rem;
                    padding: 1rem;
                    border: 1px solid rgba(255,255,255,.06);
                    background: rgba(255,255,255,.03);
                    border-radius: 18px;
                    backdrop-filter: blur(12px);
                }

                .register-point-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: rgba(28,224,235,.1);
                    border: 1px solid rgba(28,224,235,.18);
                    color: #9cf7fb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .register-point-icon svg {
                    width: 20px;
                    height: 20px;
                    stroke: currentColor;
                    fill: none;
                    stroke-width: 1.8;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .register-point h4 {
                    margin: 0 0 .2rem;
                    color: #fff;
                    font-size: .95rem;
                }

                .register-point p {
                    margin: 0;
                    color: rgba(224,247,248,.5);
                    font-size: .86rem;
                    line-height: 1.6;
                }

                .register-back {
                    display: inline-flex;
                    align-items: center;
                    gap: .55rem;
                    margin-top: 1.4rem;
                    color: rgba(224,247,248,.52);
                    text-decoration: none;
                    font-size: .86rem;
                    transition: color .2s ease;
                }

                .register-back:hover {
                    color: #b6fbff;
                }

                .register-card-wrap {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: all .8s ease .12s;
                    display: flex;
                    justify-content: center;
                }

                .register-card-wrap.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .register-card {
                    width: 100%;
                    max-width: 520px;
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

                .register-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(28,224,235,.06), transparent 45%);
                    pointer-events: none;
                }

                .register-card-header {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 1.5rem;
                }

                .register-brand {
                    display: flex;
                    align-items: center;
                    gap: .9rem;
                    margin-bottom: 1rem;
                }

                .register-brand-badge {
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

                .register-brand-text h1 {
                    margin: 0;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.8rem;
                    color: #fff;
                    letter-spacing: .08em;
                    line-height: 1;
                }

                .register-brand-text p {
                    margin: .25rem 0 0 0;
                    color: rgba(224,247,248,.48);
                    font-size: .83rem;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                }

                .register-heading {
                    margin: 0;
                    font-size: 1.45rem;
                    font-weight: 700;
                    color: #fff;
                }

                .register-subheading {
                    margin: .45rem 0 0;
                    font-size: .92rem;
                    line-height: 1.65;
                    color: rgba(224,247,248,.56);
                }

                .register-form {
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
                    stroke: currentColor;
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .password-panel {
                    margin-top: .8rem;
                    border: 1px solid rgba(255,255,255,.06);
                    background: rgba(255,255,255,.03);
                    border-radius: 16px;
                    padding: 1rem;
                }

                .password-panel-top {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    align-items: center;
                    margin-bottom: .8rem;
                    flex-wrap: wrap;
                }

                .password-panel-title {
                    color: #d9fbfd;
                    font-size: .85rem;
                    font-weight: 600;
                }

                .password-strength {
                    font-size: .8rem;
                    color: rgba(224,247,248,.62);
                }

                .password-bar {
                    width: 100%;
                    height: 8px;
                    border-radius: 999px;
                    background: rgba(255,255,255,.08);
                    overflow: hidden;
                    margin-bottom: .9rem;
                }

                .password-bar-fill {
                    height: 100%;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #0D666B, #1CE0EB);
                    transition: width .25s ease;
                }

                .password-rules {
                    display: grid;
                    gap: .55rem;
                }

                .password-rule {
                    display: flex;
                    align-items: center;
                    gap: .65rem;
                    color: rgba(224,247,248,.52);
                    font-size: .83rem;
                    transition: color .2s ease;
                }

                .password-rule.valid {
                    color: #b9fbff;
                }

                .password-rule-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,.18);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: rgba(255,255,255,.03);
                }

                .password-rule.valid .password-rule-icon {
                    border-color: rgba(28,224,235,.4);
                    background: rgba(28,224,235,.12);
                }

                .password-rule-icon svg {
                    width: 11px;
                    height: 11px;
                    stroke: currentColor;
                    fill: none;
                    stroke-width: 2.5;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .error {
                    display: block;
                    margin-top: .45rem;
                    font-size: .8rem;
                    color: #ff8e8e;
                }

                .register-btn {
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
                    margin-top: .4rem;
                }

                .register-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 16px 34px rgba(28,224,235,.28);
                }

                .register-btn:disabled {
                    opacity: .72;
                    cursor: not-allowed;
                    transform: none;
                }

                .register-bottom {
                    margin-top: 1.2rem;
                    text-align: center;
                    font-size: .88rem;
                    color: rgba(224,247,248,.48);
                }

                .register-bottom a {
                    color: #7eeef4;
                    text-decoration: none;
                    font-weight: 600;
                }

                @media (max-width: 960px) {
                    .register-shell {
                        grid-template-columns: 1fr;
                    }

                    .register-side {
                        text-align: center;
                        padding-right: 0;
                    }

                    .register-points {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .register-badge,
                    .register-back {
                        justify-content: center;
                    }
                }

                @media (max-width: 640px) {
                    .register-root {
                        padding: 1rem;
                    }

                    .register-card {
                        padding: 1.4rem;
                        border-radius: 22px;
                    }

                    .register-heading {
                        font-size: 1.2rem;
                    }

                    .register-title {
                        font-size: 3rem;
                    }

                    .register-brand {
                        gap: .7rem;
                    }

                    .register-brand-badge {
                        width: 46px;
                        height: 46px;
                        font-size: 1.2rem;
                    }

                    .password-panel-top {
                        align-items: flex-start;
                        flex-direction: column;
                    }
                }
            `}</style>

            <div className="register-root">
                <canvas ref={canvasRef} className="register-canvas" />
                <div className="register-glow-1" />
                <div className="register-glow-2" />
                <div className="register-glow-3" />

                <div className="register-shell">
                    <section className={`register-side ${loaded ? 'visible' : ''}`}>
                        <div className="register-badge">
                            <span className="register-badge-dot" />
                            Nuevo acceso
                        </div>

                        <h2 className="register-title">
                            Crea tu cuenta en
                            <span>Club Bolívar</span>
                        </h2>

                        <p className="register-text">
                            Regístrate para ingresar al sistema y comenzar a gestionar accesos,
                            membresías, socios y operaciones desde una interfaz moderna y segura.
                        </p>

                        <div className="register-points">
                            <div className="register-point">
                                <div className="register-point-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Acceso protegido</h4>
                                    <p>Credenciales seguras para ingresar al panel del sistema.</p>
                                </div>
                            </div>

                            <div className="register-point">
                                <div className="register-point-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Gestión rápida</h4>
                                    <p>Interfaz pensada para trabajo ágil en web y futura app móvil.</p>
                                </div>
                            </div>

                            <div className="register-point">
                                <div className="register-point-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M4 7h16M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 11h6M9 15h4M9 3h6l1 4H8l1-4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4>Base del sistema</h4>
                                    <p>Desde aquí se conectará la administración de socios y accesos.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/" className="register-back">
                            ← Volver al inicio
                        </Link>
                    </section>

                    <section className={`register-card-wrap ${loaded ? 'visible' : ''}`}>
                        <div className="register-card">
                            <div className="register-card-header">
                                <div className="register-brand">
                                    <div className="register-brand-badge">B</div>
                                    <div className="register-brand-text">
                                        <h1>Club Bolívar</h1>
                                        <p>Sistema de acceso</p>
                                    </div>
                                </div>

                                <h3 className="register-heading">Crear cuenta</h3>
                                <p className="register-subheading">
                                    Completa tus datos para registrarte en la plataforma.
                                </p>
                            </div>

                            <form onSubmit={submit} className="register-form">
                                <div className="input-group">
                                    <label className="input-label">Nombre completo</label>
                                    <div className="input-shell">
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            placeholder="Tu nombre completo"
                                            autoComplete="name"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Correo electrónico</label>
                                    <div className="input-shell">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            placeholder="email@gmail.com"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Contraseña</label>
                                    <div className="input-shell password-shell">
                                        <input
                                            id="password"
                                            type={showPass ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            placeholder="Crea una contraseña"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="pass-toggle"
                                            onClick={() => setShowPass(!showPass)}
                                            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            {showPass ? (
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M3 3l18 18" />
                                                    <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
                                                    <path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c7 0 10 7 10 7a17.3 17.3 0 0 1-4.1 4.9" />
                                                    <path d="M6.7 6.7C4.1 8.3 2 12 2 12a17.7 17.7 0 0 0 7.2 5.8" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <div className="password-panel">
                                        <div className="password-panel-top">
                                            <div className="password-panel-title">
                                                Requisitos de contraseña
                                            </div>
                                            <div className="password-strength">
                                                Nivel: {strengthLabel}
                                            </div>
                                        </div>

                                        <div className="password-bar">
                                            <div
                                                className="password-bar-fill"
                                                style={{ width: `${(passwordStrength / passwordRules.length) * 100}%` }}
                                            />
                                        </div>

                                        <div className="password-rules">
                                            {passwordRules.map((rule) => (
                                                <div
                                                    key={rule.key}
                                                    className={`password-rule ${rule.valid ? 'valid' : ''}`}
                                                >
                                                    <div className="password-rule-icon">
                                                        <svg viewBox="0 0 16 16">
                                                            {rule.valid ? (
                                                                <path d="M3 8l3 3 7-7" />
                                                            ) : (
                                                                <path d="M4 4l8 8M12 4L4 12" />
                                                            )}
                                                        </svg>
                                                    </div>
                                                    <span>{rule.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {errors.password && <span className="error">{errors.password}</span>}
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Confirmar contraseña</label>
                                    <div className="input-shell password-shell">
                                        <input
                                            id="password_confirmation"
                                            type={showPassConfirm ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            placeholder="Repite tu contraseña"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="pass-toggle"
                                            onClick={() => setShowPassConfirm(!showPassConfirm)}
                                            aria-label={showPassConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            {showPassConfirm ? (
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M3 3l18 18" />
                                                    <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
                                                    <path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c7 0 10 7 10 7a17.3 17.3 0 0 1-4.1 4.9" />
                                                    <path d="M6.7 6.7C4.1 8.3 2 12 2 12a17.7 17.7 0 0 0 7.2 5.8" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {errors.password_confirmation && (
                                        <span className="error">{errors.password_confirmation}</span>
                                    )}
                                </div>

                                <button type="submit" className="register-btn" disabled={processing}>
                                    {processing ? 'Creando cuenta...' : 'Registrarme'}
                                </button>

                                <div className="register-bottom">
                                    ¿Ya tienes una cuenta? <Link href={route('login')}>Inicia sesión</Link>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}