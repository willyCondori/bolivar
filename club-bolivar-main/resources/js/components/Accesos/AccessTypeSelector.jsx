export default function AccessTypeSelector({
    tipo,
    setTipo,
    activeClass = 'btn-active-purple',
}) {
    return (
        <div className="access-actions">

            <button
                type="button"
                className={`btn-secondary ${
                    tipo === 'entrada'
                        ? activeClass
                        : ''
                }`}
                onClick={() => setTipo('entrada')}
            >
                Entrada
            </button>

            <button
                type="button"
                className={`btn-secondary ${
                    tipo === 'salida'
                        ? activeClass
                        : ''
                }`}
                onClick={() => setTipo('salida')}
            >
                Salida
            </button>
        </div>
    );
}