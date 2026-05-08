export default function AccessResult({
    reconResult,
    loading,
    loadingText = 'Procesando...',
    emptyText = 'Esperando...',
}) {
    return (
        <div
            className={`access-result ${
                reconResult?.estado === 'exito'
                    ? 'access-result-success'
                    : reconResult?.estado === 'fallo'
                    ? 'access-result-error'
                    : ''
            }`}
        >
            {!reconResult && !loading && (
                <p className="access-note">
                    {emptyText}
                </p>
            )}

            {loading && (
                <p className="access-note">
                    {loadingText}
                </p>
            )}

            {reconResult?.estado === 'exito' && (
                <>
                    <span className="access-result-icon">
                        ✅
                    </span>

                    <p className="access-result-name">
                        {reconResult.nombres}{' '}
                        {reconResult.apellidos}
                    </p>

                    <span className="badge-success">
                        Acceso permitido
                    </span>
                </>
            )}

            {reconResult?.estado === 'fallo' && (
                <>
                    <span className="access-result-icon">
                        ❌
                    </span>

                    <p className="access-result-name text-danger">
                        Acceso denegado
                    </p>
                </>
            )}
        </div>
    );
}