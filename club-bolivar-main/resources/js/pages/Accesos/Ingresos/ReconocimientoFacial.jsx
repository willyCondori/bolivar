import { useEffect, useMemo, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import axios from 'axios';

import AccessHeader from '@/components/Accesos/AccessHeader';
import AccessTypeSelector from '@/components/Accesos/AccessTypeSelector';
import AccessResult from '@/components/Accesos/AccessResult';
import AccessAlert from '@/components/Accesos/AccessAlert';
import AccessActions from '@/components/Accesos/AccessActions';
import AccessNavigation from '@/components/Accesos/AccessNavigation';

export default function ReconocimientoFacial() {

    const { auth } = usePage().props;

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [reconResult, setReconResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tipo, setTipo] = useState('entrada');

    const canUseCamera = useMemo(
        () =>
            typeof navigator !== 'undefined' &&
            !!navigator.mediaDevices?.getUserMedia,
        []
    );

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        setError(null);
        setReconResult(null);

        if (!canUseCamera) {
            setStatus('error');
            setError('Este navegador no soporta acceso a cámara.');
            return;
        }

        try {
            setStatus('requesting');

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' },
                    audio: false,
                });

            streamRef.current = stream;

            const video = videoRef.current;

            video.srcObject = stream;
            video.muted = true;
            video.playsInline = true;
            video.autoplay = true;

            await video.play();

            setStatus('running');

        } catch (e) {

            setStatus(
                e?.name === 'NotAllowedError'
                    ? 'blocked'
                    : 'error'
            );

            setError(
                e?.message ??
                'No se pudo iniciar la cámara.'
            );
        }
    };

    const stopCamera = () => {

        streamRef.current?.getTracks()
            .forEach(track => track.stop());

        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStatus('idle');
    };

    const reconocer = async () => {

        if (!videoRef.current || status !== 'running') {
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0);
        ctx.restore();

        canvas.toBlob(async (blob) => {

            if (!blob) return;

            const formData = new FormData();

            formData.append(
                'imagen',
                blob,
                'capture.jpg'
            );

            formData.append('tipo', tipo);

            setLoading(true);
            setReconResult(null);

            try {

                const response = await axios.post(
                    route('accesos.reconocer'),
                    formData,
                    {
                        headers: {
                            'Content-Type':
                                'multipart/form-data',
                        },
                    }
                );

                setReconResult(response.data);

                } catch (e) {

                    if (e.response?.status === 429) {
                        // Bloqueo de 3 minutos — mostrar datos del socio
                        setReconResult({
                            ...e.response.data,
                            nombres: e.response.data.nombres,
                            apellidos: e.response.data.apellidos,
                        });
                    } else {
                        setReconResult({
                            estado: 'error',
                            mensaje:
                                e.response?.data?.mensaje ??
                                'Error del servidor.',
                        });
                    }

                }
        }, 'image/jpeg', 0.9);
    };

    return (
        <AppSidebarLayout title="Reconocimiento facial">

            <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
            />

            <div className="access-grid">

                <div className="access-card">

                    <AccessHeader
                        user={auth?.user?.name}
                    />

                    <h1 className="access-title">
                        Módulo de
                        <span>
                            Reconocimiento Facial
                        </span>
                    </h1>

                    <p className="access-description">
                        Iniciá la cámara y presioná reconocer.
                    </p>

                    <div className="rf-videoWrap">

                        <video
                            ref={videoRef}
                            className="rf-video"
                            playsInline
                            muted
                            autoPlay
                        />

                        {status !== 'running' && (
                            <div className="rf-placeholder">
                                Vista previa
                            </div>
                        )}
                    </div>

                    <AccessActions>

                        <button
                            className="btn-primary"
                            onClick={startCamera}
                        >
                            Iniciar cámara
                        </button>

                        <button
                            className="btn-secondary"
                            onClick={reconocer}
                        >
                            Reconocer
                        </button>

                        <button
                            className="btn-danger"
                            onClick={stopCamera}
                        >
                            Detener
                        </button>

                    </AccessActions>

                    <AccessAlert
                        error={error}
                        reconResult={reconResult}
                    />
                </div>

                <div className="access-card">

                    <h2 className="access-section-title">
                        Tipo de acceso
                    </h2>

                    <AccessTypeSelector
                        tipo={tipo}
                        setTipo={setTipo}
                        activeClass="btn-active-cyan"
                    />

                    <AccessResult
                        reconResult={reconResult}
                        loading={loading}
                        loadingText="Analizando..."
                        emptyText="Esperando acción..."
                    />

                    <AccessNavigation
                        href={route('accesos.qr')}
                        text="📷 Ir a Escaneo QR"
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
}