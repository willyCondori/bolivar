import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/Layouts/AppSidebarLayout';

// ─── Estilos ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

.bloqueo-wrap {
  max-width: 860px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 1.5rem;
}

/* ── Cabecera de socio ── */
.socio-card {
  display: flex; align-items: center; gap: 1.5rem;
  padding: 1.5rem 1.75rem; border-radius: 22px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
}

.socio-avatar {
  width: 76px; height: 76px; border-radius: 50%; flex-shrink: 0;
  object-fit: cover;
  border: 2px solid rgba(28,224,235,.25);
  box-shadow: 0 0 18px rgba(28,224,235,.12);
}
.socio-avatar-placeholder {
  width: 76px; height: 76px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(28,224,235,.12), rgba(13,102,107,.18));
  border: 2px solid rgba(28,224,235,.25);
  display: flex; align-items: center; justify-content: center;
  color: #1CE0EB; font-family: 'Bebas Neue', sans-serif; font-size: 2rem;
}

.socio-info { flex: 1; min-width: 0; }
.socio-nombre { color: #fff; font-size: 1.35rem; font-weight: 700; line-height: 1.1; }
.socio-numero { color: rgba(28,224,235,.8); font-size: .82rem; letter-spacing: .1em; margin-top: .3rem; }
.socio-meta   { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .85rem; }

.meta-pill {
  padding: .32rem .75rem; border-radius: 999px; font-size: .75rem; font-weight: 600;
  letter-spacing: .06em; text-transform: uppercase;
}
.pill-activo   { background: rgba(34,197,94,.12); border: 1px solid rgba(34,197,94,.22); color: #86efac; }
.pill-inactivo { background: rgba(239,68,68,.12);  border: 1px solid rgba(239,68,68,.22);  color: #fca5a5; }
.pill-membresia { background: rgba(28,224,235,.08); border: 1px solid rgba(28,224,235,.16); color: #bafcff; }

/* ── Panel de consecuencias ── */
.consequences {
  padding: 1.25rem 1.5rem; border-radius: 18px;
  background: rgba(239,68,68,.06);
  border: 1px solid rgba(239,68,68,.18);
}
.consequences-title {
  color: #f87171; font-size: .85rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase; margin-bottom: .9rem;
  display: flex; align-items: center; gap: .5rem;
}
.consequences-list { display: grid; gap: .55rem; }
.consequence-row {
  display: flex; align-items: center; gap: .75rem;
  color: rgba(255,255,255,.72); font-size: .88rem;
}
.consequence-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,.5);
}

/* ── Campo de motivo ── */
.field-wrap { display: flex; flex-direction: column; gap: .6rem; }
.field-label { color: rgba(224,247,248,.7); font-size: .82rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.field-textarea {
  width: 100%; resize: vertical; min-height: 100px;
  padding: .9rem 1rem; border-radius: 14px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09);
  color: #e0f7f8; font-family: 'Inter', sans-serif; font-size: .92rem;
  line-height: 1.55; outline: none; transition: border-color .2s, box-shadow .2s;
  box-sizing: border-box;
}
.field-textarea::placeholder { color: rgba(224,247,248,.25); }
.field-textarea:focus { border-color: rgba(239,68,68,.45); box-shadow: 0 0 0 3px rgba(239,68,68,.08); }
.field-error { color: #f87171; font-size: .8rem; }

/* ── Checkbox de confirmación ── */
.confirm-row {
  display: flex; align-items: flex-start; gap: .85rem;
  padding: 1.1rem 1.25rem; border-radius: 16px;
  background: rgba(239,68,68,.05); border: 1px solid rgba(239,68,68,.14);
  cursor: pointer; user-select: none;
}
.confirm-check {
  width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; margin-top: 1px;
  border: 2px solid rgba(239,68,68,.4); background: transparent;
  display: flex; align-items: center; justify-content: center; transition: .2s;
}
.confirm-check.checked { background: #ef4444; border-color: #ef4444; }
.confirm-check svg { width: 12px; height: 12px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.confirm-text { color: rgba(224,247,248,.75); font-size: .88rem; line-height: 1.5; }
.confirm-text strong { color: #f87171; }

/* ── Botones ── */
.actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.btn {
  height: 48px; padding: 0 1.75rem; border-radius: 14px; border: none;
  font-family: 'Inter', sans-serif; font-size: .88rem; font-weight: 700;
  letter-spacing: .05em; text-transform: uppercase; cursor: pointer;
  transition: .2s ease; display: inline-flex; align-items: center; gap: .5rem;
}
.btn:disabled { opacity: .4; cursor: not-allowed; }

.btn-cancel {
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
  color: rgba(224,247,248,.7);
}
.btn-cancel:not(:disabled):hover { background: rgba(255,255,255,.09); color: #fff; }

.btn-block {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: #fff; box-shadow: 0 4px 18px rgba(239,68,68,.25);
}
.btn-block:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(239,68,68,.35); }
.btn-block:not(:disabled):active { transform: translateY(0); }

/* ── Modal de éxito ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.6);
  backdrop-filter: blur(6px); z-index: 100;
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: linear-gradient(160deg, rgba(7,17,31,.97), rgba(4,11,20,.99));
  border: 1px solid rgba(239,68,68,.25); border-radius: 24px;
  padding: 2.5rem; max-width: 420px; width: 90%; text-align: center;
  box-shadow: 0 24px 64px rgba(0,0,0,.5);
}
.modal-icon {
  width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 1.25rem;
  background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.3);
  display: flex; align-items: center; justify-content: center;
}
.modal-icon svg { width: 28px; height: 28px; stroke: #f87171; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.modal-title { color: #fff; font-size: 1.3rem; font-weight: 700; margin-bottom: .5rem; }
.modal-sub   { color: rgba(224,247,248,.5); font-size: .88rem; line-height: 1.5; }
.modal-btn   { margin-top: 1.75rem; }
`;

let cssInjected = false;
function injectCSS() {
    if (cssInjected) return;
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    cssInjected = true;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function BloqueoSocio({ socio }) {
    injectCSS();

    const { errors } = usePage().props;
    const [motivo,    setMotivo]    = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading,   setLoading]   = useState(false);
    const [success,   setSuccess]   = useState(false);

    const handleBloquear = () => {
        if (!confirmed || loading) return;
        setLoading(true);
        router.post(
            route('socios.bloquear', socio.id),
            { motivo },
            {
                onSuccess: () => setSuccess(true),
                onError:   () => setLoading(false),
                onFinish:  () => setLoading(false),
            }
        );
    };

    const inicial = (socio.nombres?.[0] ?? '?').toUpperCase();
    const nombreCompleto = `${socio.nombres} ${socio.apellidos}`;
    const membresiaActiva = socio.membresias?.find(m => m.estado === 'activo');

    return (
        <AppSidebarLayout title="Bloquear Socio">
            <Head title={`Bloquear — ${nombreCompleto}`} />

            <div className="bloqueo-wrap">

                {/* ── Tarjeta del socio ── */}
                <div className="socio-card">
                    {socio.foto_path
                        ? <img src={`/storage/${socio.foto_path}`} alt={nombreCompleto} className="socio-avatar" />
                        : <div className="socio-avatar-placeholder">{inicial}</div>
                    }
                    <div className="socio-info">
                        <div className="socio-nombre">{nombreCompleto}</div>
                        <div className="socio-numero">N° {socio.numero_socio} · CI {socio.ci}</div>
                        <div className="socio-meta">
                            <span className={`meta-pill ${socio.estado === 'Activo' ? 'pill-activo' : 'pill-inactivo'}`}>
                                {socio.estado}
                            </span>
                            {membresiaActiva && (
                                <span className="meta-pill pill-membresia">
                                    Membresía {membresiaActiva.tipo} · vence {new Date(membresiaActiva.fecha_fin).toLocaleDateString('es-BO')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Consecuencias ── */}
                <div className="consequences">
                    <div className="consequences-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 9v4M12 17h.01"/>
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        </svg>
                        Esta acción realizará los siguientes cambios
                    </div>
                    <div className="consequences-list">
                        {[
                            'El Socio estara bloqueado del sistema',
                            'Usuario sin acceso al sistema',
                            'Membresía invalida',
                            'El socio perderá acceso inmediato al sistema',
                        ].map(txt => (
                            <div className="consequence-row" key={txt}>
                                <span className="consequence-dot" />
                                {txt}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Motivo ── */}
                <div className="field-wrap">
                    <label className="field-label">Motivo del bloqueo (opcional)</label>
                    <textarea
                        className="field-textarea"
                        placeholder="Describe el motivo del bloqueo..."
                        value={motivo}
                        onChange={e => setMotivo(e.target.value)}
                        rows={4}
                    />
                    {errors?.motivo && <span className="field-error">{errors.motivo}</span>}
                </div>

                {/* ── Confirmación ── */}
                <div className="confirm-row" onClick={() => setConfirmed(v => !v)}>
                    <div className={`confirm-check${confirmed ? ' checked' : ''}`}>
                        {confirmed && (
                            <svg viewBox="0 0 14 14">
                                <polyline points="2,7 5.5,10.5 12,3" />
                            </svg>
                        )}
                    </div>
                    <div className="confirm-text">
                        Entiendo que esta acción <strong>bloqueará permanentemente</strong> al socio{' '}
                        <strong>{nombreCompleto}</strong> y eliminará su acceso al sistema.
                    </div>
                </div>

                {/* ── Botones ── */}
                <div className="actions">
                    <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={() => window.history.back()}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-block"
                        onClick={handleBloquear}
                        disabled={!confirmed || loading}
                    >
                        {loading ? 'Bloqueando...' : '🔒 Confirmar bloqueo'}
                    </button>
                </div>
            </div>

            {/* ── Modal de éxito ── */}
            {success && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-icon">
                            <svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                        </div>
                        <div className="modal-title">Socio bloqueado</div>
                        <div className="modal-sub">
                            {nombreCompleto} ha sido bloqueado correctamente. Su acceso al sistema ha sido revocado.
                        </div>
                        <div className="modal-btn">
                            <button
                                className="btn btn-block"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => router.visit(route('socios.index'))}
                            >
                                Volver a la lista de socios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppSidebarLayout>
    );
}