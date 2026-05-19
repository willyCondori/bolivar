import{i as e,n as t}from"./chunk-HdlhfhqF.js";import{a as n,i as r,l as i,r as a,s as o,t as s}from"./app-yWRS4dwM.js";import{n as c,t as l}from"./AppSidebarLayout-CXpwwtid.js";function u({socios:e}){let{filtroEstado:t}=o().props,[r,i]=(0,d.useState)(``),s=r.toLowerCase(),c=(0,d.useMemo)(()=>e.filter(e=>{let t=`${e.nombres} ${e.apellidos}`.toLowerCase(),n=e.ci?.toLowerCase()||``;return t.includes(s)||n.includes(s)}),[s,e]),u=e=>{confirm(`¿Seguro que deseas desactivar este socio?`)&&n.delete(route(`socios.destroy`,e))},p=e=>{confirm(`¿Deseas reactivar este socio?`)&&n.patch(route(`socios.restore`,e))},m=({estado:e,label:n})=>(0,f.jsx)(a,{href:route(`socios.index`,{estado:e}),className:`btn-add ${t===e?`opacity-100`:`opacity-60`}`,children:n});return(0,f.jsxs)(l,{title:`Gestión de Socios`,children:[(0,f.jsx)(`style`,{children:`
                .socios-container { display: flex; flex-direction: column; gap: 1.5rem; }
                .glass-card {
                    border: 1px solid rgba(255,255,255,.07);
                    background: linear-gradient(180deg, rgba(10,20,35,.82), rgba(5,11,22,.92));
                    backdrop-filter: blur(18px);
                    border-radius: 28px;
                    box-shadow: 0 20px 60px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04);
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }
                .glass-card::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(28,224,235,.05), transparent 45%);
                }
                .glass-card > * {
                    position: relative;
                    z-index: 1;
                }
                .table-header-title {
                    margin-bottom: 1.5rem; font-size: 1.8rem; font-weight: 800; color: #fff;
                }
                .table-header-title span {
                    background: linear-gradient(135deg, #1CE0EB, #9bf8ff, #15A3AB);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .custom-table { width: 100%; border-spacing: 0 0.8rem; }
                .custom-table th {
                    padding: 1rem; color: rgba(224,247,248,.45);
                    font-size: .8rem; text-transform: uppercase;
                }
                .table-row { background: rgba(255,255,255,.03); transition: .2s; }
                .table-row:hover { background: rgba(28,224,235,.06); transform: scale(1.005); }
                .custom-table td {
                    padding: 1.2rem 1rem;
                    color: rgba(224,247,248,.8);
                }
                .socio-avatar {
                    height: 45px; width: 45px; border-radius: 12px;
                    border: 2px solid rgba(28,224,235,.3);
                }
                .badge {
                    padding: 0.4rem 0.8rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .badge-active {
                    background: rgba(28,224,235,.15);
                    color: #1CE0EB;
                }
                .badge {
                    padding: 0.45rem 0.9rem;
                    border-radius: 12px;
                    font-size: 0.72rem;
                    font-weight: 800;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 90px;
                    text-align: center;
                }
                .badge-active {
                    background: rgba(28,224,235,.15);
                    color: #1CE0EB;
                }
                .badge-blocked {
                    background: linear-gradient(135deg, #ff4b2b, #ff416c) !important;
                    color: white !important;
                    border: none !important;
                    box-shadow: 0 4px 15px rgba(255, 75, 43, 0.3);
                }
                .text-main { color: #fff; font-weight: 600; }
                .text-sub { color: rgba(224,247,248,.45); font-size: 0.85rem; }
                .btn-add {
                    background: linear-gradient(135deg, #1CE0EB, #15A3AB);
                    color: #050b16;
                    padding: 0.8rem 1.5rem;
                    border-radius: 14px;
                    font-weight: 800;
                    display: inline-flex;
                    gap: 0.5rem;
                }
            `}),(0,f.jsxs)(`div`,{className:`socios-container`,children:[(0,f.jsxs)(`div`,{className:`flex justify-between items-center px-4`,children:[(0,f.jsxs)(`h1`,{className:`table-header-title`,children:[`Listado de `,(0,f.jsx)(`span`,{children:`Socios Registrados`})]}),(0,f.jsx)(a,{href:route(`socios.create`),className:`btn-add`,children:`+ Nuevo Socio`})]}),(0,f.jsxs)(`div`,{className:`flex gap-3 px-4`,children:[(0,f.jsx)(m,{estado:`activo`,label:`Activos`}),(0,f.jsx)(m,{estado:`inactivo`,label:`Inactivos`}),(0,f.jsx)(m,{estado:`bloqueado`,label:`Bloqueados`}),(0,f.jsx)(m,{estado:`Todos`,label:`Todos`})]}),(0,f.jsxs)(`div`,{className:`glass-card`,children:[(0,f.jsx)(`div`,{className:`px-4 mb-4`,children:(0,f.jsx)(`input`,{type:`text`,placeholder:`Buscar por nombre o CI...`,value:r,onChange:e=>i(e.target.value),className:`w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white`})}),(0,f.jsxs)(`table`,{className:`custom-table`,children:[(0,f.jsx)(`thead`,{children:(0,f.jsxs)(`tr`,{children:[(0,f.jsx)(`th`,{children:`Perfil`}),(0,f.jsx)(`th`,{children:`Datos`}),(0,f.jsx)(`th`,{children:`CI`}),(0,f.jsx)(`th`,{children:`Teléfono`}),(0,f.jsx)(`th`,{children:`Membresía`}),(0,f.jsx)(`th`,{children:`Estado`}),(0,f.jsx)(`th`,{children:`Ingreso`}),(0,f.jsx)(`th`,{})]})}),(0,f.jsx)(`tbody`,{children:c.map(e=>(0,f.jsxs)(`tr`,{className:`table-row`,children:[(0,f.jsx)(`td`,{children:(0,f.jsx)(`img`,{src:`/storage/${e.foto_path}`,className:`socio-avatar`,alt:e.nombres,onError:e=>{e.target.src=`/img/default-avatar.png`}})}),(0,f.jsxs)(`td`,{children:[(0,f.jsxs)(`div`,{className:`text-main`,children:[e.nombres,` `,e.apellidos]}),(0,f.jsx)(`div`,{className:`text-sub`,children:e.email||`Sin correo`})]}),(0,f.jsx)(`td`,{className:`text-main`,children:e.ci}),(0,f.jsx)(`td`,{className:`text-main`,children:e.telefono}),(0,f.jsx)(`td`,{children:e.membresia_activa?(0,f.jsx)(`div`,{className:`text-main text-[#1CE0EB] font-bold`,children:e.membresia_activa.tipo}):(0,f.jsx)(`span`,{className:`text-xs text-gray-400`,children:`Sin membresía`})}),(0,f.jsx)(`td`,{children:(0,f.jsx)(`span`,{className:`badge ${e.estado===`activo`?`badge-active`:e.estado===`inactivo`?`bg-red-500/20 text-red-300 border border-red-500/40`:e.estado===`bloqueado`?`badge-blocked`:``}`,children:e.estado})}),(0,f.jsx)(`td`,{className:`text-main`,children:new Date(e.fecha_ingreso).toLocaleDateString()}),(0,f.jsxs)(`td`,{children:[(0,f.jsx)(a,{href:route(`socios.edit`,e.id),className:`text-main hover:text-[#1CE0EB] mr-3`,children:`Editar`}),e.estado===`activo`&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`button`,{onClick:()=>u(e.id),className:`text-red-400 mr-3`,children:`Eliminar`}),(0,f.jsx)(a,{href:route(`socios.bloquear.show`,e.id),className:`text-yellow-400`,children:`Bloquear`})]}),e.estado===`inactivo`&&(0,f.jsx)(`button`,{onClick:()=>p(e.id),className:`text-green-400`,children:`Recuperar`}),e.estado===`bloqueado`&&(0,f.jsx)(`button`,{onClick:()=>{confirm(`¿Deseas desbloquear este socio?`)&&n.patch(route(`socios.desbloquear`,e.id))},className:`text-cyan-400`,children:`Desbloquear`})]})]},e.id))})]})]})]})]})}var d,f;t((()=>{r(),c(),d=e(i()),f=s()}))();export{u as default};