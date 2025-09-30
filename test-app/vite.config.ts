import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 64849,
    strictPort: true,
    open: true,
    cors: true,
    proxy: {
      // Proxy API requests to formio server
      '/form': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/project': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})