import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

export default function Index({ notifications }) {

    const list = notifications ?? [];

    return (
        <AppSidebarLayout title="Notificaciones">
            <div className="max-w-4xl mx-auto p-6">

                <h1 className="text-2xl font-bold text-white mb-6">
                    Notificaciones
                </h1>

                <div className="space-y-4">
                    {list.length === 0 && (
                        <p className="text-gray-400">No hay notificaciones</p>
                    )}

                    {list.map((n) => {

                        const data =
                            typeof n.data === 'string'
                                ? JSON.parse(n.data)
                                : n.data ?? {};

                        return (
                            <div key={n.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-white font-semibold">
                                    {data.nombres} {data.apellidos}
                                </p>
                                <p className="text-sm text-gray-300 mt-1">
                                    {data.mensaje}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Tipo de acceso: <span className="capitalize">{data.tipo}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(n.created_at).toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppSidebarLayout>
    );
}