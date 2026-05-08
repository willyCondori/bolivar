import { Link } from '@inertiajs/react';

export default function AccessHeader({
    user,
    backRoute = 'dashboard',
}) {
    return (
        <div className="access-top">
            <div className="access-user">
                {user ?? 'Usuario'}
            </div>

            <Link
                href={route(backRoute)}
                className="access-back"
            >
                ← Volver al dashboard
            </Link>
        </div>
    );
}