import{n as e}from"./chunk-HdlhfhqF.js";import{t}from"./app-yWRS4dwM.js";import{n,t as r}from"./AppSidebarLayout-CXpwwtid.js";function i({membresias:e=[]}){return(0,a.jsxs)(r,{title:`Membresías`,children:[(0,a.jsx)(`div`,{className:`max-w-6xl mx-auto p-4`,children:(0,a.jsxs)(`div`,{className:`dashboard-card`,children:[(0,a.jsxs)(`div`,{className:`flex justify-between items-center mb-6`,children:[(0,a.jsxs)(`h1`,{className:`dashboard-hero-title`,children:[`Gestión de `,(0,a.jsx)(`span`,{children:`Membresías`})]}),(0,a.jsxs)(`span`,{className:`text-xs text-gray-400`,children:[`Total tipos: `,e.length]})]}),e.length===0&&(0,a.jsx)(`p`,{className:`text-gray-400`,children:`No hay membresías registradas`}),(0,a.jsx)(`div`,{className:`space-y-6`,children:e.map(e=>{let t=o[e.tipo]||{};return(0,a.jsxs)(`div`,{className:`membresia-group`,children:[(0,a.jsxs)(`div`,{className:`flex items-center justify-between mb-3`,children:[(0,a.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,a.jsx)(`span`,{className:`text-xl`,children:t.icon}),(0,a.jsx)(`h2`,{className:`font-bold text-lg`,style:{color:t.color||`#1CE0EB`},children:e.tipo})]}),(0,a.jsxs)(`span`,{className:`badge-total`,children:[e.total,` socios`]})]}),(0,a.jsx)(`div`,{className:`tabla-container`,children:(0,a.jsxs)(`table`,{className:`tabla`,children:[(0,a.jsx)(`thead`,{children:(0,a.jsxs)(`tr`,{children:[(0,a.jsx)(`th`,{children:`Socio`}),(0,a.jsx)(`th`,{children:`Estado`}),(0,a.jsx)(`th`,{children:`Inicio`}),(0,a.jsx)(`th`,{children:`Fin`})]})}),(0,a.jsx)(`tbody`,{children:e.socios.map(e=>(0,a.jsxs)(`tr`,{children:[(0,a.jsx)(`td`,{children:e.nombre}),(0,a.jsx)(`td`,{children:(0,a.jsx)(`span`,{className:`estado ${e.estado===`activo`?`activo`:`inactivo`}`,children:e.estado})}),(0,a.jsx)(`td`,{children:e.fecha_inicio}),(0,a.jsx)(`td`,{children:e.fecha_fin})]},e.id))})]})})]},e.tipo)})})]})}),(0,a.jsx)(`style`,{children:`
                .dashboard-card {
                    background: rgba(0,0,0,.55);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 24px;
                    padding: 2rem;
                    backdrop-filter: blur(14px);
                }

                .dashboard-hero-title {
                    font-size: 1.8rem;
                    font-weight: 900;
                    color: white;
                }

                .dashboard-hero-title span {
                    color: #1CE0EB;
                }

                .membresia-group {
                    border-top: 1px solid rgba(255,255,255,.08);
                    padding-top: 1rem;
                }

                .badge-total {
                    font-size: .7rem;
                    padding: .3rem .7rem;
                    border-radius: 999px;
                    background: rgba(255,255,255,.08);
                    color: #aaa;
                }

                .tabla-container {
                    overflow-x: auto;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,.08);
                }

                .tabla {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: .85rem;
                    color: white;
                }

                .tabla thead {
                    background: rgba(255,255,255,.05);
                }

                .tabla th {
                    text-align: left;
                    padding: .8rem;
                    font-size: .7rem;
                    text-transform: uppercase;
                    color: #aaa;
                }

                .tabla td {
                    padding: .7rem;
                    border-top: 1px solid rgba(255,255,255,.05);
                }

                .tabla tr:hover {
                    background: rgba(255,255,255,.03);
                }

                .estado {
                    font-size: .7rem;
                    padding: .2rem .6rem;
                    border-radius: 999px;
                    font-weight: bold;
                }

                .estado.activo {
                    background: rgba(34,197,94,.2);
                    color: #22c55e;
                }

                .estado.inactivo {
                    background: rgba(239,68,68,.2);
                    color: #ef4444;
                }
            `})]})}var a,o;e((()=>{n(),a=t(),o={Celeste:{color:`#00BFFF`,icon:`🔵`},Dorado:{color:`#FFD700`,icon:`🥇`},Platino:{color:`#E5E4E2`,icon:`💎`}}}))();export{i as default};