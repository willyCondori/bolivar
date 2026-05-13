// resources/js/config/dashboardRoles.js
export const ROLES = {
    admin: {
        title: ['Panel de', 'Administración General'],
        text: 'Desde aquí el administrador podrá gestionar socios, membresías, accesos, reportes, bloqueos y configuración general del sistema.',
        stats: [
            { num: 'Socios',   label: 'Gestión completa',      cta: 'Registrar nuevo socio →',    href: 'socios.create' },
            { num: 'Accesos',  label: 'Control y seguimiento',  cta: 'Reconocimiento facial →',    href: 'reconocimiento.index' },
            { num: 'Reportes', label: 'Ingresos de accesos',    cta: 'Ver reporte de accesos →',   href: 'reportes.ingresos' },
        ],
        actions: [
            { title: 'Lo que hará este rol',  text: 'Ver todos los módulos, aprobar procesos y administrar el sistema.' },
            { title: 'Próximos módulos',       text: 'Socios, membresías, reportes y seguridad.' },
        ],
    },
    operador: {
        title: ['Panel de', 'Operación de Accesos'],
        text: 'Valida ingresos mediante QR o reconocimiento facial.',
        stats: [
            { num: 'Facial',  label: 'Biometría',         cta: 'Iniciar →',   href: 'accesos.facial' },
            { num: 'QR',      label: 'Control operativo', cta: 'Escanear →',  href: 'accesos.qr' },
            { num: 'Soporte', label: 'Incidencias' },
        ],
        actions: [
            { title: 'Rol operador', text: 'Control de accesos en tiempo real.' },
        ],
    },
    socio: {
        title: ['Bienvenido a', 'Tu Panel de Socio'],
        text: 'Consulta tu membresía y accesos.',
        stats: [
            { num: 'Carnet', label: 'Disponible',      cta: 'Ver →',    href: 'socio.panel' },
            { num: 'Perfil', label: 'Datos personales', cta: 'Editar →', href: 'profile.edit' },
        ],
        actions: [
            { title: 'Tu acceso', text: 'Gestión personal del socio.' },
        ],
    },
};

export const DEFAULT_ROLE = 'admin';