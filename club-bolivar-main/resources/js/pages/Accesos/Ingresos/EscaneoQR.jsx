import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

import AccessHeader from '@/components/Accesos/AccessHeader';
import AccessTypeSelector from '@/components/Accesos/AccessTypeSelector';
import AccessResult from '@/components/Accesos/AccessResult';
import AccessAlert from '@/components/Accesos/AccessAlert';
import AccessButtons from '@/components/Accesos/AccessButtons';
import AccessNavigation from '@/components/Accesos/AccessNavigation';

export default function EscaneoQR() {
    const { auth } = usePage().props;

    const qrRef = useRef(null);
    const startedRef = useRef(false);

    const [tipo, setTipo] = useState('entrada');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);

    const startQR = async () => {
        if (startedRef.current) return;

        setScanning(true);

        const scanner = new Html5Qrcode('qr-reader');
        qrRef.current = scanner;

        await scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: 250 },
            async (text) => {
                await stopQR();

                setLoading(true);

                try {
                    const res = await axios.post('/api/accesos/qr', {
                        codigo: text,
                        tipo,
                    });

                    setResult(res.data);
                } finally {
                    setLoading(false);
                }
            }
        );

        startedRef.current = true;
    };

    const stopQR = async () => {
        try {
            await qrRef.current?.stop();
            await qrRef.current?.clear();
        } catch {}

        qrRef.current = null;
        startedRef.current = false;
        setScanning(false);
    };

    useEffect(() => {
        return () => stopQR();
    }, []);

    return (
        <AppSidebarLayout title="Escaneo QR">

            <div className="access-grid">

                <div className="access-card qr-card">

                    <AccessHeader user={auth?.user?.name} />

                    <h1 className="access-title">
                        Módulo <span>QR</span>
                    </h1>

                    <div id="qr-reader" />

                    <AccessButtons
                        onStart={startQR}
                        onStop={stopQR}
                        onAction={() => {}}
                        actionLabel="Escanear"
                        disableAction={loading}
                    />

                    <AccessAlert
                        error={null}
                        reconResult={result}
                    />

                </div>

                <div className="access-card">

                    <h2>Tipo de acceso</h2>

                    <AccessTypeSelector
                        tipo={tipo}
                        setTipo={setTipo}
                    />

                    <AccessResult
                        reconResult={result}
                        loading={loading}
                    />

                    <AccessNavigation
                        href={route('accesos.facial')}
                        text="🤳 Ir a Facial"
                    />

                </div>

            </div>

        </AppSidebarLayout>
    );
}