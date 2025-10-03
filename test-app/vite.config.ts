import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use SWC for faster refresh (React 19 compatible)
      jsxRuntime: 'automatic',
      // Enable React Fast Refresh
      fastRefresh: true,
    })
  ],

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
    sourcemap: true,

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },

    // Rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: (id) => {
          // React core libraries
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }

          // Form.io libraries
          if (id.includes('node_modules/@formio/react') ||
              id.includes('node_modules/@formio/js') ||
              id.includes('node_modules/@formio/core')) {
            return 'vendor-formio';
          }

          // Uppy and TUS
          if (id.includes('node_modules/@uppy') ||
              id.includes('node_modules/tus-js-client')) {
            return 'vendor-uppy';
          }

          // File upload module
          if (id.includes('node_modules/@formio/file-upload') ||
              id.includes('packages/formio-file-upload')) {
            return 'vendor-file-upload';
          }

          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
        },

        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

  // Optimization settings
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@formio/react',
      '@formio/js'
    ]
  }
})