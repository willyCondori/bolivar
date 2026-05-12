import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

import AccessHeader from '@/components/Accesos/AccessHeader';
import AccessTypeSelector from '@/components/Accesos/AccessTypeSelector';
import AccessResult from '@/components/Accesos/AccessResult';
import AccessAlert from '@/components/Accesos/AccessAlert';
import AccessActions from '@/components/Accesos/AccessActions';
import AccessNavigation from '@/components/Accesos/AccessNavigation';

export default function EscaneoQR() {

    const { auth } = usePage().props;

    const [tipo, setTipo] = useState('entrada');
    const [reconResult, setReconResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);

    const qrScannerRef = useRef(null);
    const qrStartedRef = useRef(false);
    const qrInitializingRef = useRef(false);

    useEffect(() => {
        return () => stopQR();
    }, []);

    /* ─────────────────────────────────────────
       Stop QR
    ───────────────────────────────────────── */
    const stopQR = async () => {

        try {

            if (
                qrScannerRef.current &&
                qrStartedRef.current
            ) {
                await qrScannerRef.current.stop();

                await qrScannerRef.current.clear();
            }

        } catch {

            console.log('QR ya detenido');

        } finally {

            qrScannerRef.current = null;
            qrStartedRef.current = false;
            qrInitializingRef.current = false;

            setScanning(false);
        }
    };

    /* ─────────────────────────────────────────
       Start QR
    ───────────────────────────────────────── */
    const startQR = async () => {

        if (
            qrStartedRef.current ||
            qrInitializingRef.current
        ) {
            return;
        }

        qrInitializingRef.current = true;

        setError(null);
        setReconResult(null);
        setScanning(true);

        setTimeout(async () => {

            try {

                const html5QrCode =
                    new Html5Qrcode('qr-reader');

                qrScannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: {
                            width: 250,
                            height: 250,
                        },
                    },
                    async (decodedText) => {

                        await stopQR();

                        await procesarQR(decodedText);
                    },
                    () => {}
                );

                qrStartedRef.current = true;

            } catch (err) {

                console.error(err);

                setError(
                    'No se pudo acceder a la cámara.'
                );

                setScanning(false);

            } finally {

                qrInitializingRef.current = false;
            }

        }, 100);
    };

    /* ─────────────────────────────────────────
       Procesar QR
    ───────────────────────────────────────── */
    const procesarQR = async (codigo) => {

        if (!codigo) return;

        setLoading(true);
        setReconResult(null);

        try {

            const response = await axios.post(
                '/api/accesos/qr',
                {
                    codigo,
                    tipo,
                }
            );

            setReconResult(response.data);

        } catch (e) {

            console.error(e);

            // ✅ Respuesta del backend
            if (e.response?.data) {

                setReconResult(e.response.data);

            } else {

                setReconResult({
                    estado: 'error',
                    mensaje: 'Error procesando QR',
                });
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <AppSidebarLayout title="Escaneo QR">

            <div className="access-grid">

                {/* ─────────────────────────────
                    Panel principal
                ───────────────────────────── */}
                <div className="access-card qr-card">

                    <AccessHeader
                        user={auth?.user?.name}
                    />

                    <h1 className="access-title">
                        Módulo de
                        <span>Escaneo QR</span>
                    </h1>

                    <p className="access-description">
                        Escaneá el código QR del socio.
                    </p>

                    {/* ─────────────────────────────
                        Reader
                    ───────────────────────────── */}
                    <div className="qr-reader-wrap">

                        {!scanning && (
                            <div className="qr-placeholder">
                                📷 Cámara detenida
                            </div>
                        )}

                        <div
                            id="qr-reader"
                            style={{
                                width: '100%',
                                minHeight:
                                    scanning
                                        ? '320px'
                                        : '0px',
                                display:
                                    scanning
                                        ? 'block'
                                        : 'none',
                            }}
                        />
                    </div>

                    {/* ─────────────────────────────
                        Indicator
                    ───────────────────────────── */}
                    {scanning && (
                        <div className="qr-scanning">

                            <div className="qr-dot" />

                            Escaneando...
                        </div>
                    )}

                    {/* ─────────────────────────────
                        Actions
                    ───────────────────────────── */}
                    <AccessActions>

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={startQR}
                            disabled={
                                scanning || loading
                            }
                        >
                            Iniciar escaneo
                        </button>

                        <button
                            type="button"
                            className="btn-danger"
                            onClick={stopQR}
                            disabled={!scanning}
                        >
                            Detener
                        </button>

                    </AccessActions>

                    {/* ─────────────────────────────
                        Alerts
                    ───────────────────────────── */}
                    <AccessAlert
                        error={error}
                        reconResult={reconResult}
                    />
                </div>

                {/* ─────────────────────────────
                    Panel resultados
                ───────────────────────────── */}
                <div className="access-card">

                    <h2 className="access-section-title">
                        Tipo de acceso
                    </h2>

                    <AccessTypeSelector
                        tipo={tipo}
                        setTipo={setTipo}
                    />

                    <AccessResult
                        reconResult={reconResult}
                        loading={loading}
                        loadingText="Procesando QR..."
                        emptyText="Esperando escaneo..."
                    />

                    <AccessNavigation
                        href={route('accesos.facial')}
                        text="🤳 Ir a Reconocimiento Facial"
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
}