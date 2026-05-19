import{n as e}from"./chunk-HdlhfhqF.js";import{i as t,r as n,t as r}from"./app-yWRS4dwM.js";import{n as i,t as a}from"./AppSidebarLayout-CXpwwtid.js";function o(){return(0,s.jsxs)(a,{title:`Accesos`,children:[(0,s.jsxs)(`div`,{className:`acc-container`,children:[(0,s.jsxs)(`div`,{className:`acc-header`,children:[(0,s.jsx)(`h1`,{children:`🔐 Módulo de Accesos`}),(0,s.jsx)(`p`,{children:`Selecciona el método de control de ingreso`})]}),(0,s.jsxs)(`div`,{className:`acc-grid`,children:[(0,s.jsxs)(n,{href:route(`accesos.facial`),className:`acc-card acc-facial`,children:[(0,s.jsx)(`div`,{className:`acc-icon`,children:`🧠`}),(0,s.jsx)(`h2`,{children:`Reconocimiento Facial`}),(0,s.jsx)(`p`,{children:`Validación biométrica en tiempo real mediante cámara`}),(0,s.jsx)(`span`,{className:`acc-tag`,children:`Acceso seguro`})]}),(0,s.jsxs)(n,{href:route(`accesos.qr`),className:`acc-card acc-qr`,children:[(0,s.jsx)(`div`,{className:`acc-icon`,children:`📷`}),(0,s.jsx)(`h2`,{children:`Escaneo QR`}),(0,s.jsx)(`p`,{children:`Ingreso rápido mediante código QR dinámico`}),(0,s.jsx)(`span`,{className:`acc-tag`,children:`Acceso rápido`})]})]})]}),(0,s.jsx)(`style`,{children:`
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
            `})]})}var s;e((()=>{t(),i(),s=r()}))();export{o as default};