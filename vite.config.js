import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // Memberitahu Vite untuk mendengarkan di semua alamat IP yang tersedia
    host: '0.0.0.0', 
    
    // Ini adalah kunci utama: secara eksplisit izinkan host dari ngrok
    // Tanda titik di depan berfungsi sebagai wildcard, mengizinkan semua subdomain
    allowedHosts: ['.ngrok-free.app'] 
  },
})
