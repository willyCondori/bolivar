import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

export default function EscaneoQR() {
    const { auth } = usePage().props;

    const [tipo,        setTipo]        = useState('entrada');
    const [reconResult, setReconResult] = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const [scanning,    setScanning]    = useState(false);

    const qrScannerRef    = useRef(null);
    const qrStartedRef    = useRef(false);
    const qrInitializingRef = useRef(false);

    /* ── Cleanup al desmontar ────────────────────────────────────────────── */
    useEffect(() => {
        return () => {
            stopQR();
        };
    }, []);

    /* ── QR helpers ─────────────────────────────────────────────────────── */
    const stopQR = async () => {
        try {
            if (qrScannerRef.current && qrStartedRef.current) {
                await qrScannerRef.current.stop();
                await qrScannerRef.current.clear();
            }
        } catch (e) {
            console.log('QR ya detenido');
        } finally {
            qrScannerRef.current  = null;
            qrStartedRef.current  = false;
            qrInitializingRef.current = false;
            setScanning(false);
        }
    };

    /* ... tus imports y estados se mantienen igual ... */

    const startQR = async () => {
        if (qrStartedRef.current || qrInitializingRef.current) return;
        qrInitializingRef.current = true;

        setError(null);
        setReconResult(null);
        
        // 1. Primero activamos el estado de escaneo para que React muestre el <div>
        setScanning(true);

        // 2. Usamos un pequeño delay o esperamos al siguiente "tick" del event loop
        // para asegurar que el <div id="qr-reader"> ya esté en el DOM con display: block
        setTimeout(async () => {
            try {
                const html5QrCode = new Html5Qrcode("qr-reader");
                qrScannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    async (decodedText) => {
                        console.log("QR leído:", decodedText);
                        await stopQR();
                        await procesarQR(decodedText);
                    },
                    () => { /* Error de escaneo silencioso */ }
                );

                qrStartedRef.current = true;
            } catch (err) {
                console.error(err);
                setError("No se pudo acceder a la cámara. Verifica los permisos.");
                setScanning(false); // Revertimos si falla
            } finally {
                qrInitializingRef.current = false;
            }
        }, 100); // 100ms es suficiente para que el DOM se actualice
    };

    const procesarQR = async (codigo) => {
        if (!codigo) return;

        setLoading(true);
        setReconResult(null);

        try {
            const res = await axios.post('/api/accesos/qr', {
                codigo: codigo,
                tipo:   tipo,
            });
            setReconResult(res.data);
        } catch (e) {
            setReconResult({
                estado:  'error',
                mensaje: 'Error procesando QR',
            });
        } finally {
            setLoading(false);
        }
    };

    /* ── Colores dinámicos ──────────────────────────────────────────────── */
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
        <AppSidebarLayout title="Escaneo QR">
            <style>{`
                .qr-grid {
                    display: grid;
                    grid-template-columns: 1.1fr .9fr;
                    gap: 1.5rem;
                    align-items: start;
                }
                .qr-card {
                    border: 1px solid rgba(255,255,255,.07);
                    background: linear-gradient(180deg, rgba(10,20,35,.82), rgba(5,11,22,.92));
                    backdrop-filter: blur(18px);
                    border-radius: 28px;
                    box-shadow: 0 20px 60px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04);
                    padding: 1.6rem;
                    position: relative;
                    overflow: hidden;
                }
                .qr-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(129,140,248,.05), transparent 45%);
                    pointer-events: none;
                }
                .qr-card > * { position: relative; z-index: 1; }
                .qr-title {
                    margin: 0;
                    font-size: clamp(1.6rem, 3.2vw, 2.3rem);
                    font-weight: 850;
                    line-height: 1.1;
                    color: #fff;
                }
                .qr-title span {
                    display: block;
                    background: linear-gradient(135deg, #818cf8, #c4b5fd, #6d28d9);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .qr-text {
                    margin-top: 1rem;
                    color: rgba(224,224,255,.58);
                    line-height: 1.8;
                    font-size: .96rem;
                }
                .qr-readerWrap {
                    margin-top: 1.2rem;
                    border-radius: 22px;
                    border: 1px solid rgba(255,255,255,.08);
                    background: rgba(255,255,255,.02);
                    overflow: hidden;
                    min-height: 300px;
                    display: grid;
                    place-items: center;
                }
                .qr-placeholder {
                    color: rgba(224,224,255,.40);
                    font-weight: 650;
                    letter-spacing: .02em;
                    padding: 2rem;
                    text-align: center;
                }
                .qr-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: .75rem;
                    margin-top: 1.2rem;
                }
                .qr-btn {
                    height: 46px;
                    padding: 0 1.1rem;
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,.10);
                    background: rgba(255,255,255,.04);
                    color: rgba(224,224,255,.80);
                    font-weight: 800;
                    letter-spacing: .06em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: opacity .2s;
                }
                .qr-btnPrimary {
                    border: none;
                    background: linear-gradient(135deg, #818cf8, #4f46e5);
                    color: #fff;
                }
                .qr-btnStop {
                    border: none;
                    background: rgba(251,113,133,.15);
                    border: 1px solid rgba(251,113,133,.25);
                    color: #fb7185;
                }
                .qr-btn:disabled { opacity: .45; cursor: not-allowed; }
                .qr-alert {
                    margin-top: 1rem;
                    padding: .9rem 1rem;
                    border-radius: 18px;
                    border: 1px solid rgba(251,113,133,.22);
                    background: rgba(251,113,133,.10);
                    color: rgba(255,255,255,.86);
                    line-height: 1.6;
                    font-size: .92rem;
                }
                .qr-topRow {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .qr-user {
                    color: rgba(224,224,255,.45);
                    font-size: .84rem;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .qr-back { color: rgba(224,224,255,.70); text-decoration: none; font-weight: 750; }
                .qr-back:hover { color: #fff; }
                .qr-result {
                    margin-top: 1rem;
                    padding: 1.2rem;
                    border-radius: 18px;
                    transition: background .3s, border-color .3s;
                }
                .qr-resultIcon { font-size: 2rem; margin-bottom: .4rem; display: block; }
                .qr-resultName {
                    font-size: 1.6rem;
                    font-weight: 850;
                    color: #fff;
                    margin: .2rem 0;
                    letter-spacing: -.01em;
                }
                .qr-badge {
                    display: inline-block;
                    margin-top: .6rem;
                    padding: .25rem .75rem;
                    border-radius: 8px;
                    font-size: .8rem;
                    font-weight: 800;
                    letter-spacing: .05em;
                    text-transform: uppercase;
                }
                .qr-badgeOk {
                    background: rgba(34,197,94,.2);
                    color: #4ade80;
                    border: 1px solid rgba(34,197,94,.30);
                }
                .qr-badgeFail {
                    background: rgba(251,113,133,.15);
                    color: #fb7185;
                    border: 1px solid rgba(251,113,133,.25);
                }
                .qr-noteTitle {
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 750;
                    margin: 0 0 .5rem;
                }
                .qr-noteText {
                    margin: 0;
                    color: rgba(224,224,255,.52);
                    line-height: 1.7;
                    font-size: .9rem;
                }
                .qr-scanIndicator {
                    display: flex;
                    align-items: center;
                    gap: .5rem;
                    margin-top: .75rem;
                    color: #4ade80;
                    font-size: .88rem;
                    font-weight: 700;
                }
                .qr-scanDot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: #4ade80;
                    animation: pulse 1.2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: .4; transform: scale(.7); }
                }
                @media (max-width: 1024px) {
                    .qr-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="qr-grid">

                {/* ── Panel izquierdo: lector QR ──────────────────────────── */}
                <div className="qr-card">
                    <div className="qr-topRow">
                        <div className="qr-user">{auth?.user?.name ?? 'Usuario'}</div>
                        <Link className="qr-back" href={route('dashboard')}>
                            ← Volver al dashboard
                        </Link>
                    </div>

                    <h1 className="qr-title">
                        Módulo de
                        <span>Escaneo QR</span>
                    </h1>

                    <p className="qr-text">
                        Presioná <strong>Iniciar escaneo</strong>, apuntá la cámara al código QR
                        del socio y el acceso se registrará automáticamente.
                    </p>

                    <div className="qr-readerWrap">
                        {!scanning && (
                            <div className="qr-placeholder">
                                📷 Cámara detenida — presioná "Iniciar escaneo QR"
                            </div>
                        )}
                        <div
                            id="qr-reader"
                            style={{
                                width: '100%',
                                minHeight: scanning ? '300px' : '0px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                display: scanning ? 'block' : 'none',
                            }}
                        />
                    </div>

                    {scanning && (
                        <div className="qr-scanIndicator">
                            <div className="qr-scanDot" />
                            Escaneando…
                        </div>
                    )}

                    <div className="qr-actions">
                        <button
                            type="button"
                            className="qr-btn qr-btnPrimary"
                            onClick={startQR}
                            disabled={scanning || loading}
                        >
                            Iniciar escaneo QR
                        </button>

                        <button
                            type="button"
                            className="qr-btn qr-btnStop"
                            onClick={stopQR}
                            disabled={!scanning}
                        >
                            Detener
                        </button>
                    </div>

                    {error && <div className="qr-alert">{error}</div>}
                    {reconResult?.estado === 'bloqueado' && (
                        <div
                            className="qr-alert"
                            style={{ border: '1px solid rgba(251,191,36,.3)', background: 'rgba(251,191,36,.10)' }}
                        >
                            ⚠️ {reconResult.mensaje}
                        </div>
                    )}
                </div>

                {/* ── Panel derecho: resultado ─────────────────────────────── */}
                <div className="qr-card">

                    <h2 className="qr-noteTitle">Tipo de acceso</h2>
                    <div className="qr-actions">
                        <button
                            className={`qr-btn ${tipo === 'entrada' ? 'qr-btnPrimary' : ''}`}
                            onClick={() => setTipo('entrada')}
                        >
                            Entrada
                        </button>
                        <button
                            className={`qr-btn ${tipo === 'salida' ? 'qr-btnPrimary' : ''}`}
                            onClick={() => setTipo('salida')}
                        >
                            Salida
                        </button>
                    </div>

                    <div
                        className="qr-result"
                        style={{ background: resultBg, border: `1px solid ${resultBorder}`, marginTop: '1.5rem' }}
                    >
                        {!reconResult && !loading && (
                            <p className="qr-noteText">Esperando escaneo...</p>
                        )}
                        {loading && (
                            <p className="qr-noteText">Procesando QR...</p>
                        )}
                        {reconResult?.estado === 'exito' && (
                            <>
                                <span className="qr-resultIcon">✅</span>
                                <p className="qr-resultName">
                                    {reconResult.nombres} {reconResult.apellidos}
                                </p>
                                <span className="qr-badge qr-badgeOk">Acceso permitido</span>
                            </>
                        )}
                        {reconResult?.estado === 'fallo' && (
                            <>
                                <span className="qr-resultIcon">❌</span>
                                <p className="qr-resultName" style={{ color: '#fb7185' }}>
                                    Acceso denegado
                                </p>
                            </>
                        )}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <Link
                            href={route('accesos.facial')}
                            className="qr-btn qr-btnPrimary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', textDecoration: 'none' }}
                        >
                            🤳 Ir a Reconocimiento Facial
                        </Link>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}