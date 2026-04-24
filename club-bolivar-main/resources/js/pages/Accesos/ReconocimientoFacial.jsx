    import { useEffect, useMemo, useRef, useState } from 'react';
    import { Link, usePage, router } from '@inertiajs/react';
    import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
    import axios from 'axios';

    export default function ReconocimientoFacial() {
        const { auth } = usePage().props;
        const videoRef  = useRef(null);
        const canvasRef = useRef(null);
        const streamRef = useRef(null);

        const [status,      setStatus]      = useState('idle'); // idle | requesting | running | blocked | error
        const [error,       setError]       = useState(null);
        const [reconResult, setReconResult] = useState(null);  // null | objeto respuesta
        const [loading,     setLoading]     = useState(false);
        const [tipo, setTipo] = useState('entrada');
        const canUseCamera = useMemo(() =>
            typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
        , []);

        // Limpiar cámara al desmontar
        useEffect(() => {
            return () => {
                streamRef.current?.getTracks().forEach(t => t.stop());
            };
        }, []);

        /* ── Cámara ─────────────────────────────────────────────────────────── */
        const startCamera = async () => {
            setError(null);
            setReconResult(null);

            if (!canUseCamera) {
                setStatus('error');
                setError('Este navegador no soporta acceso a cámara (getUserMedia).');
                return;
            }

            try {
                setStatus('requesting');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' },
                    audio: false,
                });

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                setStatus('running');
            } catch (e) {
                setStatus(e?.name === 'NotAllowedError' ? 'blocked' : 'error');
                setError(e?.message ?? 'No se pudo iniciar la cámara.');
            }
        };

        const stopCamera = () => {
            streamRef.current?.getTracks().forEach(t => t.stop());
            streamRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
            setStatus('idle');
            setError(null);
            setReconResult(null);
        };

        /* ── Capturar frame y enviar a Laravel ──────────────────────────────── */
        const reconocer = async () => {
            if (!videoRef.current || status !== 'running') return;

                const canvas = canvasRef.current;
                const video = videoRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext('2d');
                ctx.save();
                // No espejamos la imagen enviada al servidor para que la IA la vea natural
                ctx.scale(-1, 1);
                ctx.drawImage(video, -canvas.width, 0);
                ctx.restore();

                canvas.toBlob(async (blob) => {
                    if (!blob) return;

                    const formData = new FormData();
                    formData.append('imagen', blob, 'capture.jpg');
                    formData.append('tipo', tipo);
                    
                    setLoading(true);
                    setReconResult(null);

                    try {
                        // Laravel procesa automáticamente el CSRF si usas Axios con la config por defecto de Breeze
                        // Pero lo forzamos aquí para asegurar compatibilidad:
                        const response = await axios.post(route('accesos.reconocer'), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json',
                            },
                        });

                        setReconResult(response.data);
                    } catch (e) {
                        console.error(e);
                        setReconResult({
                            estado: 'error',
                            mensaje: e.response?.data?.mensaje ?? 'Error de comunicación con el servidor.',
                        });
                    } finally {
                        setLoading(false);
                    }
                }, 'image/jpeg', 0.90);
            };
        /* ── Colores dinámicos del panel resultado ──────────────────────────── */
        const resultBg = reconResult?.estado === 'exito'
            ? 'rgba(34,197,94,.12)'
            : reconResult?.estado === 'fallo'
                ? 'rgba(251,113,133,.10)'
                : 'rgba(255,255,255,.03)';

        const resultBorder = reconResult?.estado === 'exito'
            ? 'rgba(34,197,94,.30)'
            : reconResult?.estado === 'fallo'
                ? 'rgba(251,113,133,.22)'
                : 'rgba(255,255,255,.06)';

        return (
            <AppSidebarLayout title="Reconocimiento facial">
                <style>{`
                    .rf-grid {
                        display: grid;
                        grid-template-columns: 1.1fr .9fr;
                        gap: 1.5rem;
                        align-items: start;
                    }

                    .rf-card {
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

                    .rf-card::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(135deg, rgba(28,224,235,.05), transparent 45%);
                        pointer-events: none;
                    }

                    .rf-card > * { position: relative; z-index: 1; }

                    .rf-title {
                        margin: 0;
                        font-size: clamp(1.6rem, 3.2vw, 2.3rem);
                        font-weight: 850;
                        line-height: 1.1;
                        color: #fff;
                    }

                    .rf-title span {
                        display: block;
                        background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .rf-text {
                        margin-top: 1rem;
                        color: rgba(224,247,248,.58);
                        line-height: 1.8;
                        font-size: .96rem;
                    }

                    .rf-videoWrap {
                        margin-top: 1.2rem;
                        border-radius: 22px;
                        border: 1px solid rgba(255,255,255,.08);
                        background: rgba(255,255,255,.02);
                        overflow: hidden;
                        aspect-ratio: 16 / 9;
                        display: grid;
                        place-items: center;
                    }

                    .rf-video {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transform: scaleX(-1); /* espejo solo visual */
                    }

                    .rf-placeholder {
                        color: rgba(224,247,248,.40);
                        font-weight: 650;
                        letter-spacing: .02em;
                    }

                    .rf-actions {
                        display: flex;
                        flex-wrap: wrap;
                        gap: .75rem;
                        margin-top: 1.2rem;
                    }

                    .rf-btn {
                        height: 46px;
                        padding: 0 1.1rem;
                        border-radius: 14px;
                        border: 1px solid rgba(255,255,255,.10);
                        background: rgba(255,255,255,.04);
                        color: rgba(224,247,248,.80);
                        font-weight: 800;
                        letter-spacing: .06em;
                        text-transform: uppercase;
                        cursor: pointer;
                        transition: opacity .2s;
                    }

                    .rf-btnPrimary {
                        border: none;
                        background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                        color: #031019;
                    }

                    .rf-btnRecon {
                        border: none;
                        background: linear-gradient(135deg, #818cf8, #4f46e5);
                        color: #fff;
                    }

                    .rf-btn:disabled { opacity: .45; cursor: not-allowed; }

                    .rf-note {
                        margin-top: 1rem;
                        padding: 1rem;
                        border-radius: 18px;
                        background: rgba(255,255,255,.03);
                        border: 1px solid rgba(255,255,255,.06);
                    }

                    .rf-noteTitle {
                        color: #fff;
                        font-size: 1rem;
                        font-weight: 750;
                        margin: 0 0 .5rem;
                    }

                    .rf-noteText {
                        margin: 0;
                        color: rgba(224,247,248,.52);
                        line-height: 1.7;
                        font-size: .9rem;
                    }

                    .rf-alert {
                        margin-top: 1rem;
                        padding: .9rem 1rem;
                        border-radius: 18px;
                        border: 1px solid rgba(251,113,133,.22);
                        background: rgba(251,113,133,.10);
                        color: rgba(255,255,255,.86);
                        line-height: 1.6;
                        font-size: .92rem;
                    }

                    .rf-topRow {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;
                    }

                    .rf-user {
                        color: rgba(224,247,248,.45);
                        font-size: .84rem;
                        letter-spacing: .08em;
                        text-transform: uppercase;
                        font-weight: 700;
                    }

                    .rf-back { color: rgba(224,247,248,.70); text-decoration: none; font-weight: 750; }
                    .rf-back:hover { color: #fff; }

                    /* Panel resultado */
                    .rf-result {
                        margin-top: 1rem;
                        padding: 1.2rem;
                        border-radius: 18px;
                        transition: background .3s, border-color .3s;
                    }

                    .rf-resultIcon { font-size: 2rem; margin-bottom: .4rem; display: block; }

                    .rf-resultName {
                        font-size: 1.6rem;
                        font-weight: 850;
                        color: #fff;
                        margin: .2rem 0;
                        letter-spacing: -.01em;
                    }

                    .rf-resultSub {
                        color: rgba(224,247,248,.50);
                        font-size: .88rem;
                        margin: 0;
                    }

                    .rf-badge {
                        display: inline-block;
                        margin-top: .6rem;
                        padding: .25rem .75rem;
                        border-radius: 8px;
                        font-size: .8rem;
                        font-weight: 800;
                        letter-spacing: .05em;
                        text-transform: uppercase;
                    }

                    .rf-badgeOk {
                        background: rgba(34,197,94,.2);
                        color: #4ade80;
                        border: 1px solid rgba(34,197,94,.30);
                    }

                    .rf-badgeFail {
                        background: rgba(251,113,133,.15);
                        color: #fb7185;
                        border: 1px solid rgba(251,113,133,.25);
                    }

                    .rf-spinner {
                        width: 16px; height: 16px;
                        border: 2px solid rgba(255,255,255,.25);
                        border-top-color: #fff;
                        border-radius: 50%;
                        animation: spin .7s linear infinite;
                        display: inline-block;
                        margin-right: .5rem;
                        vertical-align: middle;
                    }

                    @keyframes spin { to { transform: rotate(360deg); } }

                    @media (max-width: 1024px) {
                        .rf-grid { grid-template-columns: 1fr; }
                    }
                `}</style>

                {/* Canvas oculto para capturar frames */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <div className="rf-grid">

                    {/* ── Panel izquierdo: cámara ─────────────────────────────── */}
                    <div className="rf-card">
                        <div className="rf-topRow">
                            <div className="rf-user">{auth?.user?.name ?? 'Usuario'}</div>
                            <Link className="rf-back" href={route('dashboard')}>
                                ← Volver al dashboard
                            </Link>
                        </div>

                        <h1 className="rf-title">
                            Módulo de
                            <span>Reconocimiento Facial</span>
                        </h1>

                        <p className="rf-text">
                            Iniciá la cámara, posicioná el rostro dentro del encuadre y presioná{' '}
                            <strong>Reconocer</strong> para validar el acceso.
                        </p>

                        <div className="rf-videoWrap">
                            {/* El video siempre existe, pero solo se muestra si el status es running */}
                            <video 
                                ref={videoRef} 
                                className="rf-video" 
                                style={{ display: status === 'running' ? 'block' : 'none' }}
                                playsInline 
                                muted 
                            />
                            
                            {status !== 'running' && (
                                <div className="rf-placeholder">
                                    {status === 'requesting'
                                        ? 'Solicitando permiso de cámara…'
                                        : 'Vista previa de cámara'}
                                </div>
                            )}
                        </div>

                        <div className="rf-actions">
                           
                            <button
                                type="button"
                                className="rf-btn rf-btnPrimary"
                                onClick={startCamera}
                                disabled={status === 'requesting' || status === 'running'}
                            >
                                Iniciar cámara
                            </button>

                            <button
                                type="button"
                                className="rf-btn rf-btnRecon"
                                onClick={reconocer}
                                disabled={status !== 'running' || loading}
                            >
                                {loading && <span className="rf-spinner" />}
                                {loading ? 'Analizando…' : 'Reconocer'}
                            </button>

                            <button
                                type="button"
                                className="rf-btn"
                                onClick={stopCamera}
                                disabled={status !== 'running'}
                            >
                                Detener
                            </button>
                        </div>

                        {error && <div className="rf-alert">{error}</div>}
                        {reconResult?.estado === 'bloqueado' && (
                            <div
                                className="rf-alert"
                                style={{ border: '1px solid rgba(251,191,36,.3)', background: 'rgba(251,191,36,.10)' }}
                            >
                                ⚠️ {reconResult.mensaje}
                            </div>
                        )}                        
                    </div>

                    {/* ── Panel derecho: resultado ─────────────────────────────── */}
                    <div className="rf-card">
                        <h2 className="rf-noteTitle">Checklist operativo</h2>
                        <p className="rf-noteText">
                            — Iluminación frontal y estable.<br />
                            — Evitar gorras / lentes oscuros.<br />
                            — Confirmar que el socio esté activo antes de validar.
                        </p>

                        <div className="rf-actions">
                                <button
                                    type="button"
                                    className={`rf-btn ${tipo === 'entrada' ? 'rf-btnPrimary' : ''}`}
                                    onClick={() => setTipo('entrada')}
                                >
                                    Entrada
                                </button>

                                <button
                                    type="button"
                                    className={`rf-btn ${tipo === 'salida' ? 'rf-btnPrimary' : ''}`}
                                    onClick={() => setTipo('salida')}
                                >
                                    Salida
                                </button>
                            </div>

                        {/* Resultado dinámico */}
                        <div
                            className="rf-result"
                            style={{ background: resultBg, border: `1px solid ${resultBorder}` }}
                        >
                            {/* Estado vacío */}
                            {!reconResult && !loading && (
                                <>
                                    <p className="rf-noteTitle">Resultado</p>
                                    <p className="rf-noteText">
                                        Presioná <strong>Reconocer</strong> para identificar al socio.
                                        El resultado de coincidencia, membresía y registro de acceso
                                        aparecerán aquí.
                                    </p>
                                </>
                            )}

                            {/* Cargando */}
                            {loading && (
                                <p className="rf-noteText" style={{ margin: 0 }}>
                                    <span className="rf-spinner" />
                                    Analizando rostro con el modelo…
                                </p>
                            )}

                            {/* Éxito */}
                            {!loading && reconResult?.estado === 'exito' && (
                                <>
                                    <span className="rf-resultIcon">✅</span>
                                    <p className="rf-noteText" style={{ margin: 0 }}>Persona identificada</p>
                                    <p className="rf-resultName">
                                        {reconResult.nombres} {reconResult.apellidos}
                                    </p>
                                    <p className="rf-resultSub">
                                        Similitud: {(1 - reconResult.distancia).toFixed(2) * 100}%
                                        &nbsp;·&nbsp;
                                        Distancia: {reconResult.distancia}
                                    </p>
                                    <span className="rf-badge rf-badgeOk">Acceso permitido</span>
                                </>
                            )}

                            {/* Fallo */}
                            {!loading && reconResult?.estado === 'fallo' && (
                                <>
                                    <span className="rf-resultIcon">❌</span>

                                    <p className="rf-resultName" style={{ color: '#fb7185' }}>
                                        Usuario no identificado
                                    </p>

                                    <p className="rf-resultSub">
                                        El rostro no coincide con ningún socio registrado.
                                    </p>

                                    <span className="rf-badge rf-badgeFail">
                                        Acceso denegado
                                    </span>
                                </>
                            )}

                            {/* Error de conexión */}
                            {!loading && reconResult?.estado === 'error' && (
                                <p className="rf-noteText" style={{ margin: 0, color: '#fb7185' }}>
                                    ⚠️ {reconResult.mensaje}
                                </p>
                            )}
                            {/* Bloqueo temporal */}
                            {!loading && reconResult?.estado === 'bloqueado' && (
                                <>
                                    <span className="rf-resultIcon">⛔</span>

                                    <p className="rf-resultName" style={{ color: '#fbbf24' }}>
                                        Acceso bloqueado
                                    </p>

                                    <p className="rf-resultSub">
                                        Este socio ya registró un acceso reciente. Intenta nuevamente en unos minutos.
                                    </p>

                                    <span
                                        className="rf-badge"
                                        style={{
                                            background: 'rgba(251,191,36,.15)',
                                            color: '#fbbf24',
                                            border: '1px solid rgba(251,191,36,.3)'
                                        }}
                                    >
                                        Control anti-doble ingreso
                                    </span>
                                </>
                            )}
                        </div>

                        {status === 'blocked' && (
                            <div className="rf-alert">
                                Permiso de cámara bloqueado. Revisá permisos del navegador para
                                <code>http://127.0.0.1:8001</code> y volvé a intentar.
                            </div>
                        )}
                    </div>

                </div>
            </AppSidebarLayout>
        );
    }