import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import fs from 'fs'
import os from 'os'
import path from 'path'

function getLocalIP() {
    const interfaces = os.networkInterfaces()

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address
            }
        }
    }

    return 'localhost'
}

const localIP = getLocalIP()

const certPath = path.resolve('./ssl/cert.pem')
const keyPath  = path.resolve('./ssl/key.pem')

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
    ],

    server: {
        host: '0.0.0.0',

        port: 5173,

        https: false,

        strictPort: true,

        hmr: {
            host: localIP,
            protocol: 'ws',
            port: 5173,
        },

        cors: true,
    },
})