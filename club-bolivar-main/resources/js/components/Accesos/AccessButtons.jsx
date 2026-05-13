export default function AccessButtons({
    onStart,
    onStop,
    onAction,
    actionLabel = 'Acción',
    disableAction = false,
}) {
    return (
        <div className="access-actions">
            <button className="btn-primary" onClick={onStart}>
                Iniciar
            </button>

            <button className="btn-danger" onClick={onStop}>
                Detener
            </button>

            <button
                className="btn-secondary"
                onClick={onAction}
                disabled={disableAction}
            >
                {actionLabel}
            </button>
        </div>
    );
}