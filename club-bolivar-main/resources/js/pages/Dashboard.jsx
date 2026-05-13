// resources/js/Pages/Dashboard.jsx
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';
import StatCard         from '@/components/Dashboard/StatCard';
import { useRole }      from '@/hooks/useRole';

export default function Dashboard() {
    const { config: cfg } = useRole();

    return (
        <AppSidebarLayout title="Dashboard">
            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h1 className="dashboard-hero-title">
                        {cfg.title[0]}
                        <span>{cfg.title[1]}</span>
                    </h1>
                    <p className="dashboard-hero-text">{cfg.text}</p>

                    <div className="dashboard-stats">
                        {cfg.stats.map((s) => (
                            <StatCard key={s.num} {...s} />
                        ))}
                    </div>
                </div>

                <div className="dashboard-actions">
                    {cfg.actions.map((a) => (
                        <div key={a.title} className="dashboard-card">
                            <div className="dashboard-action-title">{a.title}</div>
                            <div className="dashboard-action-text">{a.text}</div>
                        </div>
                    ))}
                </div>

            </div>
        </AppSidebarLayout>
    );
}