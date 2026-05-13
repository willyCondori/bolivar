import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

import useAccessRecognition from '@/hooks/useAccessRecognition';

import AccessHeader from '@/components/Accesos/AccessHeader';
import AccessTypeSelector from '@/components/Accesos/AccessTypeSelector';
import AccessResult from '@/components/Accesos/AccessResult';
import AccessAlert from '@/components/Accesos/AccessAlert';
import AccessNavigation from '@/components/Accesos/AccessNavigation';
import AccessButtons from '@/components/Accesos/AccessButtons';

export default function ReconocimientoFacial() {
    const { auth } = usePage().props;

    const {
        videoRef,
        canvasRef,
        status,
        error,
        loading,
        result,
        startCamera,
        stopCamera,
        reconocer,
    } = useAccessRecognition();

    const [tipo, setTipo] = useState('entrada');

    return (
        <AppSidebarLayout title="Reconocimiento facial">

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="access-grid">

                <div className="access-card">

                    <AccessHeader user={auth?.user?.name} />

                    <h1 className="access-title">
                        Módulo de <span>Reconocimiento Facial</span>
                    </h1>

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

                    <AccessButtons
                        onStart={startCamera}
                        onStop={stopCamera}
                        onAction={() => reconocer(tipo)}
                        actionLabel="Reconocer"
                        disableAction={loading}
                    />

                    <AccessAlert
                        error={error}
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
                        loadingText="Analizando..."
                        emptyText="Esperando..."
                    />

                    <AccessNavigation
                        href={route('accesos.qr')}
                        text="📷 Ir a QR"
                    />

                </div>

            </div>

        </AppSidebarLayout>
    );
}