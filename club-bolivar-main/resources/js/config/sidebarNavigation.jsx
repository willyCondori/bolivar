import { SidebarIcons as I } from '@/components/icons/sidebarIcons.jsx';

export function getSidebarNavigation(role, currentRoute) {

    const isActive = (routeName) => currentRoute === routeName;

    return {
        admin: [
            {
                label: 'Dashboard',
                href: route('dashboard'),
                active: isActive('dashboard'),
                icon: I.dashboard,
            },
            {
                label: 'Registrar Ingresos',
                href: route('reconocimiento.index'),
                active: isActive('reconocimiento.index'),
                icon: I.registro,
            },
            {
                label: 'Socios',
                href: route('socios.index'),
                active: isActive('socios.index'),
                icon: I.socios,
            },
            {
                label: 'Membresías',
                href: route('accesos.membresias'),
                active: isActive('accesos.membresias'),
                icon: I.membresias,
            },
            {
                label: 'Reportes',
                href: route('reportes.ingresos'),
                active: isActive('reportes.ingresos'),
                icon: I.reportes,
            },
            {
                label: 'Notificaciones',
                href: route('notificacion.index'),
                active: isActive('notificacion.index'),
                icon: I.alerta,
            },
            {
                label: 'Usuarios',
                href: route('users.create'),
                active: isActive('users.create'),
                icon: I.perfil,
            },
        ],

        operador: [
            {
                label: 'Dashboard',
                href: route('dashboard'),
                active: isActive('dashboard'),
                icon: I.dashboard,
            },
            {
                label: 'Notificaciones',
                href: route('notificacion.index'),
                active: isActive('notificacion.index'),
                icon: I.alerta,
            },
            {
                label: 'Registrar Ingresos',
                href: route('reconocimiento.index'),
                active: isActive('reconocimiento.index'),
                icon: I.registro,
            },
        ],

        socio: [
            {
                label: 'Mi panel',
                href: route('dashboard'),
                active: isActive('dashboard'),
                icon: I.dashboard,
            },
        ],
    }[role] || [];
}