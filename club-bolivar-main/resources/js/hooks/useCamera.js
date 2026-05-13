import { useCallback, useEffect, useRef, useState } from 'react';

export default function useCamera() {

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    const startCamera = useCallback(async () => {

        try {

            setError(null);
            setStatus('requesting');

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                    },
                    audio: false,
                });

            streamRef.current = stream;

            const video = videoRef.current;

            video.srcObject = stream;

            await video.play();

            setStatus('running');

        } catch (e) {

            setStatus('error');

            setError(
                e?.message ??
                'No se pudo acceder a la cámara.'
            );
        }

    }, []);

    const stopCamera = useCallback(() => {

        streamRef.current
            ?.getTracks()
            .forEach(track => track.stop());

        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStatus('idle');

    }, []);

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    return {
        videoRef,
        status,
        error,
        startCamera,
        stopCamera,
        setError,
    };
}