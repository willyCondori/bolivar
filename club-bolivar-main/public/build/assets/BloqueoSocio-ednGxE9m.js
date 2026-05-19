import{i as e,n as t}from"./chunk-HdlhfhqF.js";import{a as n,i as r,l as i,n as a,s as o,t as s}from"./app-yWRS4dwM.js";import{n as c,t as l}from"./AppSidebarLayout-CXpwwtid.js";function u(){if(h)return;let e=document.createElement(`style`);e.textContent=m,document.head.appendChild(e),h=!0}function d({socio:e}){u();let{errors:t}=o().props,[r,i]=(0,f.useState)(``),[s,c]=(0,f.useState)(!1),[d,m]=(0,f.useState)(!1),[h,g]=(0,f.useState)(!1),_=()=>{!s||d||(m(!0),n.post(route(`socios.bloquear`,e.id),{motivo:r},{onSuccess:()=>g(!0),onError:()=>m(!1),onFinish:()=>m(!1)}))},v=(e.nombres?.[0]??`?`).toUpperCase(),y=`${e.nombres} ${e.apellidos}`,b=e.membresias?.find(e=>e.estado===`activo`);return(0,p.jsxs)(l,{title:`Bloquear Socio`,children:[(0,p.jsx)(a,{title:`Bloquear — ${y}`}),(0,p.jsxs)(`div`,{className:`bloqueo-wrap`,children:[(0,p.jsxs)(`div`,{className:`socio-card`,children:[e.foto_path?(0,p.jsx)(`img`,{src:`/storage/${e.foto_path}`,alt:y,className:`socio-avatar`}):(0,p.jsx)(`div`,{className:`socio-avatar-placeholder`,children:v}),(0,p.jsxs)(`div`,{className:`socio-info`,children:[(0,p.jsx)(`div`,{className:`socio-nombre`,children:y}),(0,p.jsxs)(`div`,{className:`socio-numero`,children:[`N° `,e.numero_socio,` · CI `,e.ci]}),(0,p.jsxs)(`div`,{className:`socio-meta`,children:[(0,p.jsx)(`span`,{className:`meta-pill ${e.estado===`Activo`?`pill-activo`:`pill-inactivo`}`,children:e.estado}),b&&(0,p.jsxs)(`span`,{className:`meta-pill pill-membresia`,children:[`Membresía `,b.tipo,` · vence `,new Date(b.fecha_fin).toLocaleDateString(`es-BO`)]})]})]})]}),(0,p.jsxs)(`div`,{className:`consequences`,children:[(0,p.jsxs)(`div`,{className:`consequences-title`,children:[(0,p.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,p.jsx)(`path`,{d:`M12 9v4M12 17h.01`}),(0,p.jsx)(`path`,{d:`M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z`})]}),`Esta acción realizará los siguientes cambios`]}),(0,p.jsx)(`div`,{className:`consequences-list`,children:[`El Socio estara bloqueado del sistema`,`Usuario sin acceso al sistema`,`Membresía invalida`,`El socio perderá acceso inmediato al sistema`].map(e=>(0,p.jsxs)(`div`,{className:`consequence-row`,children:[(0,p.jsx)(`span`,{className:`consequence-dot`}),e]},e))})]}),(0,p.jsxs)(`div`,{className:`field-wrap`,children:[(0,p.jsx)(`label`,{className:`field-label`,children:`Motivo del bloqueo (opcional)`}),(0,p.jsx)(`textarea`,{className:`field-textarea`,placeholder:`Describe el motivo del bloqueo...`,value:r,onChange:e=>i(e.target.value),rows:4}),t?.motivo&&(0,p.jsx)(`span`,{className:`field-error`,children:t.motivo})]}),(0,p.jsxs)(`div`,{className:`confirm-row`,onClick:()=>c(e=>!e),children:[(0,p.jsx)(`div`,{className:`confirm-check${s?` checked`:``}`,children:s&&(0,p.jsx)(`svg`,{viewBox:`0 0 14 14`,children:(0,p.jsx)(`polyline`,{points:`2,7 5.5,10.5 12,3`})})}),(0,p.jsxs)(`div`,{className:`confirm-text`,children:[`Entiendo que esta acción `,(0,p.jsx)(`strong`,{children:`bloqueará permanentemente`}),` al socio`,` `,(0,p.jsx)(`strong`,{children:y}),` y eliminará su acceso al sistema.`]})]}),(0,p.jsxs)(`div`,{className:`actions`,children:[(0,p.jsx)(`button`,{type:`button`,className:`btn btn-cancel`,onClick:()=>window.history.back(),disabled:d,children:`Cancelar`}),(0,p.jsx)(`button`,{type:`button`,className:`btn btn-block`,onClick:_,disabled:!s||d,children:d?`Bloqueando...`:`🔒 Confirmar bloqueo`})]})]}),h&&(0,p.jsx)(`div`,{className:`modal-backdrop`,children:(0,p.jsxs)(`div`,{className:`modal`,children:[(0,p.jsx)(`div`,{className:`modal-icon`,children:(0,p.jsxs)(`svg`,{viewBox:`0 0 24 24`,children:[(0,p.jsx)(`rect`,{x:`4`,y:`11`,width:`16`,height:`9`,rx:`2`}),(0,p.jsx)(`path`,{d:`M8 11V8a4 4 0 0 1 8 0v3`})]})}),(0,p.jsx)(`div`,{className:`modal-title`,children:`Socio bloqueado`}),(0,p.jsxs)(`div`,{className:`modal-sub`,children:[y,` ha sido bloqueado correctamente. Su acceso al sistema ha sido revocado.`]}),(0,p.jsx)(`div`,{className:`modal-btn`,children:(0,p.jsx)(`button`,{className:`btn btn-block`,style:{width:`100%`,justifyContent:`center`},onClick:()=>n.visit(route(`socios.index`)),children:`Volver a la lista de socios`})})]})})]})}var f,p,m,h;t((()=>{f=e(i()),r(),c(),p=s(),m=`
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
`,h=!1}))();export{d as default};