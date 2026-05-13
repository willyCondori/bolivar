import { useCallback, useEffect, useRef, useState } from 'react';

export default function useQRScanner(onScan) {

    const qrScannerRef = useRef(null);

    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);

    const startQR = useCallback(async () => {

        try {

            setError(null);

            const { Html5Qrcode } = await import(
                'html5-qrcode'
            );

            const qr = new Html5Qrcode('qr-reader');

            qrScannerRef.current = qr;

            await qr.start(
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

                    onScan(decodedText);
                }
            );

            setScanning(true);

        } catch (e) {

            setError(
                'No se pudo iniciar el escáner.'
            );
        }

    }, [onScan]);

    const stopQR = useCallback(async () => {

        try {

            if (qrScannerRef.current) {

                await qrScannerRef.current.stop();

                await qrScannerRef.current.clear();
            }

        } catch {}

        qrScannerRef.current = null;

        setScanning(false);

    }, []);

    useEffect(() => {
        return () => stopQR();
    }, [stopQR]);

    return {
        scanning,
        error,
        startQR,
        stopQR,
        setError,
    };
}