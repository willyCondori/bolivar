import { Link } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

export default function Reconocimiento() {
    return (
        <AppSidebarLayout title="Accesos">

            <div className="acc-container">

                <div className="acc-header">
                    <h1>🔐 Módulo de Accesos</h1>
                    <p>Selecciona el método de control de ingreso</p>
                </div>

                <div className="acc-grid">

                    {/* FACIAL */}
                    <Link href={route('accesos.facial')} className="acc-card acc-facial">
                        <div className="acc-icon">🧠</div>
                        <h2>Reconocimiento Facial</h2>
                        <p>Validación biométrica en tiempo real mediante cámara</p>
                        <span className="acc-tag">Acceso seguro</span>
                    </Link>

                    {/* QR */}
                    <Link href={route('accesos.qr')} className="acc-card acc-qr">
                        <div className="acc-icon">📷</div>
                        <h2>Escaneo QR</h2>
                        <p>Ingreso rápido mediante código QR dinámico</p>
                        <span className="acc-tag">Acceso rápido</span>
                    </Link>

                </div>

            </div>

            <style>{`
                .acc-container {
                    padding: 2.5rem;
                    color: #fff;
                }

                .acc-header {
                    margin-bottom: 2rem;
                }

                .acc-header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 0;
                }

                .acc-header p {
                    color: rgba(255,255,255,.6);
                    margin-top: .5rem;
                }

                .acc-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .acc-card {
                    position: relative;
                    padding: 2rem;
                    border-radius: 20px;
                    text-decoration: none;
                    color: #fff;
                    background: linear-gradient(145deg, rgba(15,25,45,.95), rgba(5,10,20,.95));
                    border: 1px solid rgba(255,255,255,.08);
                    overflow: hidden;
                    transition: all .3s ease;
                    box-shadow: 0 10px 30px rgba(0,0,0,.25);
                }

                .acc-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(28,224,235,.4);
                    box-shadow: 0 20px 50px rgba(0,0,0,.4);
                }

                .acc-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .acc-card h2 {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 800;
                }

                .acc-card p {
                    margin-top: .6rem;
                    font-size: .9rem;
                    color: rgba(255,255,255,.65);
                    line-height: 1.5;
                }

                .acc-tag {
                    display: inline-block;
                    margin-top: 1rem;
                    font-size: .75rem;
                    padding: .3rem .7rem;
                    border-radius: 8px;
                    background: rgba(255,255,255,.08);
                    color: rgba(255,255,255,.8);
                    letter-spacing: .05em;
                    text-transform: uppercase;
                }

                /* efectos por tipo */
                .acc-facial:hover {
                    border-color: rgba(28,224,235,.5);
                }

                .acc-qr:hover {
                    border-color: rgba(99,102,241,.5);
                }
            `}</style>

        </AppSidebarLayout>
    );
}