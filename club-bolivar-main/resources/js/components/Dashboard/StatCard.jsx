// resources/js/components/Dashboard/StatCard.jsx
import { Link } from '@inertiajs/react';

export default function StatCard({ num, label, cta, href }) {
    const body = (
        <>
            <div className="dashboard-stat-num">{num}</div>
            <div className="dashboard-stat-label">{label}</div>
            {cta && <div className="dashboard-stat-cta">{cta}</div>}
        </>
    );

    return href ? (
        <Link href={route(href)} className="dashboard-stat dashboard-stat-link">
            {body}
        </Link>
    ) : (
        <div className="dashboard-stat">{body}</div>
    );
}