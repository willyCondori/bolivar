import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function useAccessRecognition() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const canUseCamera =
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia;

    /* ─────────────── CAMARA ─────────────── */

    const startCamera = useCallback(async () => {
        setError(null);
        setResult(null);

        if (!canUseCamera) {
            setError('Navegador no soporta cámara');
            setStatus('error');
            return;
        }

        try {
            setStatus('requesting');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });

            streamRef.current = stream;

            const video = videoRef.current;
            if (!video) return;

            video.srcObject = stream;
            await video.play();

            setStatus('running');
        } catch (e) {
            setError(e?.message || 'Error al iniciar cámara');
            setStatus('error');
        }
    }, [canUseCamera]);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }

        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStatus('idle');
    }, []);

    /* ─────────────── RECONOCER ─────────────── */

    const reconocer = useCallback(async (tipo) => {
        if (!videoRef.current || status !== 'running') return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

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
            formData.append('imagen', blob, 'capture.jpg');
            formData.append('tipo', tipo);

            setLoading(true);
            setResult(null);

            try {
                const res = await axios.post(
                    route('accesos.reconocer'),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setResult(res.data);
            } catch (e) {
                setResult({
                    estado: 'error',
                    mensaje: e?.response?.data?.mensaje || 'Error',
                });
            } finally {
                setLoading(false);
            }
        }, 'image/jpeg', 0.9);
    }, [status]);

    /* ─────────────── CLEANUP REAL ─────────────── */

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    return {
        videoRef,
        canvasRef,
        status,
        error,
        loading,
        result,
        startCamera,
        stopCamera,
        reconocer,
    };
}