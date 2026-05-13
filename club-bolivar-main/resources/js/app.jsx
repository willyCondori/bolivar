import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx');

        return resolvePageComponent(
            `./pages/${name}.jsx`,
            pages
        );
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <App {...props} />
        );
    },

    progress: {
        color: '#4B5563',
    },
});