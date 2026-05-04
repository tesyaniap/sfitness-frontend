import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const certPath = path.resolve(__dirname, 'certs/cert.pem')
const keyPath  = path.resolve(__dirname, 'certs/key.pem')
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'purplish-bleach-ecosystem.ngrok-free.dev',
      'localhost',
      '192.168.43.130',
      '.trycloudflare.com',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    ...(hasCerts && {
      https: {
        cert: fs.readFileSync(certPath),
        key:  fs.readFileSync(keyPath),
      },
    }),
  },
})
