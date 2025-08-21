import { defineConfig } from 'vite'

export default defineConfig({
  base: '/viscm-web/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 5000 // Suppress warning for now
  }
})