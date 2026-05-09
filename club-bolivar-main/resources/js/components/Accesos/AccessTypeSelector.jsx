export default function AccessTypeSelector({
    tipo,
    setTipo,
}) {
    return (
        <div className="access-actions flex gap-3">
            
            <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`
                    px-4 py-2 rounded-xl font-bold transition-all
                    border
                    ${
                        tipo === 'entrada'
                            ? 'bg-green-500 text-white border-green-400 shadow-lg scale-105'
                            : 'bg-transparent text-gray-300 border-gray-600 hover:border-green-400'
                    }
                `}
            >
                Entrada
            </button>

            <button
                type="button"
                onClick={() => setTipo('salida')}
                className={`
                    px-4 py-2 rounded-xl font-bold transition-all
                    border
                    ${
                        tipo === 'salida'
                            ? 'bg-red-500 text-white border-red-400 shadow-lg scale-105'
                            : 'bg-transparent text-gray-300 border-gray-600 hover:border-red-400'
                    }
                `}
            >
                Salida
            </button>

        </div>
    );
}