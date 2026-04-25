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
console.log(`🌐 IP detectada: ${localIP}`)

const sslCert = path.resolve('./ssl/cert.pem')
const sslKey  = path.resolve('./ssl/key.pem')

let httpsConfig = true

if (fs.existsSync(sslCert) && fs.existsSync(sslKey)) {
    httpsConfig = {
        cert: fs.readFileSync(sslCert),
        key:  fs.readFileSync(sslKey),
    }
    console.log('✅ Usando certificados SSL de ./ssl/')
} else {
    console.log('⚠️  Usando certificado autofirmado')
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        https: httpsConfig,
        hmr: {
            host: localIP,
            port: 5173,
            protocol: 'wss',
        },
        cors: {
            origin: '*',
        },
    },
})