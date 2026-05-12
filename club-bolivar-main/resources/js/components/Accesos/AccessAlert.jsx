export default function AccessAlert({
    error,
    reconResult,
}) {
    return (
        <>
            {error && (
                <div className="access-alert">
                    {error}
                </div>
            )}

            {reconResult?.estado === 'bloqueado' && (
                <div className="access-alert access-alert-warning">
                    ⚠️ {reconResult.mensaje}
                </div>
            )}
        </>
    );
}