export default function AccessResult({
    reconResult,
    loading,
    loadingText = 'Procesando...',
    emptyText = 'Esperando...',
}) {
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
        <div
            className={`access-result ${
                reconResult?.estado === 'exito'
                    ? 'access-result-success'
                    : reconResult?.estado === 'fallo'
                    ? 'access-result-error'
                    : reconResult?.estado === 'bloqueado'
                    ? 'access-result-warning'
                    : ''
            }`}
        >
            {!reconResult && !loading && (
                <p className="access-note">{emptyText}</p>
            )}

            {loading && (
                <p className="access-note">{loadingText}</p>
            )}

            {reconResult?.estado === 'exito' && (
                <>
                    <span className="access-result-icon">✅</span>
                    <p className="access-result-name">
                        {reconResult.nombres} {reconResult.apellidos}
                    </p>
                    <span className="badge-success">Acceso permitido</span>
                </>
            )}

            {reconResult?.estado === 'bloqueado' && (
                <>
                    <span className="access-result-icon">⏱️</span>
                    <p className="access-result-name">
                        {reconResult.nombres} {reconResult.apellidos}
                    </p>
                    <span className="badge-warning">Entrada reciente</span>
                    <p className="access-result-message">
                        {reconResult.mensaje}
                    </p>
                    {reconResult.ultimo_acceso && (
                        <p className="access-result-time">
                            Último acceso: {formatTime(reconResult.ultimo_acceso)}
                        </p>
                    )}
                </>
            )}

            {reconResult?.estado === 'fallo' && (
                <>
                    <span className="access-result-icon">❌</span>
                    <p className="access-result-name text-danger">
                        Acceso denegado
                    </p>
                    {reconResult.mensaje && (
                        <p className="access-result-message">{reconResult.mensaje}</p>
                    )}
                </>
            )}
        </div>
    );
}