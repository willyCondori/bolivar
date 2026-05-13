import { useEffect, useRef, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import '../../../css/pages/login.css';

/* ─── Canvas de partículas ─────────────────────────────────────── */
function useParticleCanvas(ref) {
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let raf;

        const particles = Array.from({ length: 70 }, () => ({
            x:  Math.random() * window.innerWidth,
            y:  Math.random() * window.innerHeight,
            r:  Math.random() * 1.8 + 0.4,
            dx: (Math.random() - 0.5) * 0.25,
            dy: (Math.random() - 0.5) * 0.25,
            o:  Math.random() * 0.45 + 0.08,
        }));

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(28,224,235,${p.o})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, [ref]);
}

/* ─── Icono ojo ────────────────────────────────────────────────── */
const EyeIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
    </svg>
);

/* ─── Componente principal ─────────────────────────────────────── */
export default function Login({ status, canResetPassword }) {
    const [showPass, setShowPass] = useState(false);
    const [loaded,   setLoaded]   = useState(false);
    const canvasRef = useRef(null);

    useParticleCanvas(canvasRef);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 120);
        return () => clearTimeout(t);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const visibleClass = loaded ? 'is-visible' : '';

    return (
        <>
            <Head title="Login — Club Bolívar" />

            <div className="lb-root">
                <canvas ref={canvasRef} className="lb-canvas" />
                <div className="lb-glow lb-glow--1" />
                <div className="lb-glow lb-glow--2" />
                <div className="lb-glow lb-glow--3" />

                <div className="lb-shell">

                    {/* ── Columna izquierda ── */}
                    <section className={`lb-side ${visibleClass}`}>
                        <div className="lb-badge">
                            <span className="lb-badge__dot" />
                            Acceso seguro
                        </div>

                        <h2 className="lb-title">
                            Ingresa al
                            <span className="lb-title__accent">Club Bolívar</span>
                        </h2>

                        <p className="lb-description">
                            Administra accesos, membresías y validaciones desde una interfaz
                            moderna, segura y diseñada para el sistema de control del estadio.
                        </p>

                        <div className="lb-stats">
                            {[
                                { num: '24/7', label: 'Disponibilidad' },
                                { num: 'QR',   label: 'Verificación'  },
                                { num: 'IA',   label: 'Reconocimiento'},
                            ].map(({ num, label }) => (
                                <div key={label} className="lb-stat">
                                    <div className="lb-stat__num">{num}</div>
                                    <div className="lb-stat__label">{label}</div>
                                </div>
                            ))}
                        </div>

                        <Link href={route('home')} className="lb-back">
                            ← Volver al inicio
                        </Link>
                    </section>

                    {/* ── Columna derecha: tarjeta ── */}
                    <section className={`lb-card-wrap ${visibleClass}`}>
                        <div className="lb-card">

                            <div className="lb-card__header">
                                <div className="lb-brand">
                                    <div className="lb-brand__icon">B</div>
                                    <div>
                                        <p className="lb-brand__name">Club Bolívar</p>
                                        <p className="lb-brand__sub">Sistema de acceso</p>
                                    </div>
                                </div>
                                <h1 className="lb-card__title">Iniciar sesión</h1>
                                <p className="lb-card__subtitle">
                                    Ingresa con tus credenciales para acceder al panel del sistema.
                                </p>
                            </div>

                            {status && <div className="lb-status">{status}</div>}

                            <form onSubmit={submit} className="lb-form">

                                {/* Email */}
                                <div className="lb-field">
                                    <label className="lb-label" htmlFor="email">
                                        Correo electrónico
                                    </label>
                                    <div className="lb-input-wrap">
                                        <input
                                            id="email"
                                            className="lb-input"
                                            type="email"
                                            placeholder="email@gmail.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            autoComplete="username"
                                            required
                                        />
                                    </div>
                                    {errors.email && <span className="lb-error">{errors.email}</span>}
                                </div>

                                {/* Contraseña */}
                                <div className="lb-field">
                                    <label className="lb-label" htmlFor="password">
                                        Contraseña
                                    </label>
                                    <div className="lb-input-wrap">
                                        <input
                                            id="password"
                                            className="lb-input lb-input--password"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Ingresa tu contraseña"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="lb-eye"
                                            onClick={() => setShowPass((v) => !v)}
                                            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            <EyeIcon />
                                        </button>
                                    </div>
                                    {errors.password && <span className="lb-error">{errors.password}</span>}
                                </div>

                                <button type="submit" className="lb-submit" disabled={processing}>
                                    {processing ? 'Ingresando…' : 'Ingresar'}
                                </button>

                                <div className="lb-footer">
                                    ¿Aún no tienes acceso?{' '}
                                    <Link href={route('register')}>Regístrate</Link>
                                </div>

                            </form>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}