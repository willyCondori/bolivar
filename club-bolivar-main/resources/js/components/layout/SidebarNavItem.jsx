import React from 'react';
import { Link } from '@inertiajs/react';

const SidebarNavItem = React.memo(function SidebarNavItem({
    label,
    href,
    active,
    icon,
    onClick,
}) {
    return (
        <Link
            href={href}
            className={`nav-link${active ? ' active' : ''}`}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
});

export default SidebarNavItem;