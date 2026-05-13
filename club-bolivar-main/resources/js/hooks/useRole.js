// resources/js/hooks/useRole.js
import { usePage } from '@inertiajs/react';
import { ROLES, DEFAULT_ROLE } from '@/config/dashboardRoles';

export function useRole() {
    const { auth } = usePage().props;
    const roleName = auth?.user?.role?.nombre ?? DEFAULT_ROLE;
    const config   = ROLES[roleName] ?? ROLES[DEFAULT_ROLE];

    return { roleName, config, user: auth?.user };
}