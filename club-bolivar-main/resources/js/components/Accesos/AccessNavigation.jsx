import { Link } from '@inertiajs/react';

export default function AccessNavigation({
    href,
    text,
}) {
    return (
        <div className="access-link-wrap">

            <Link
                href={href}
                className="btn-primary access-link"
            >
                {text}
            </Link>
        </div>
    );
}