import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { visualizer } from 'rollup-plugin-visualizer';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const enableSourceMaps = env.VITE_ENABLE_SOURCE_MAPS !== 'false';
  const obfuscateBundle = env.VITE_OBFUSCATE_BUNDLE === 'true';

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        fastRefresh: true,
        babel: {
          plugins: [
            [
              'babel-plugin-react-compiler',
              {
                target: '19'
              }
            ]
          ]
        }
      }),
      obfuscateBundle &&
        replace({
          preventAssignment: true,
          include: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
          exclude: ['node_modules/**', '**/dist/**', '**/lib/**'],
          values: {
            '"@formio/js"': '"@internal/forms"',
            "'@formio/js'": "'@internal/forms'",
            '"@qrius/formio-react"': '"@qrius/react-forms"',
            "'@qrius/formio-react'": "'@qrius/react-forms'"
          }
        })
    ].filter(Boolean),

    server: {
      port: 64849,
      strictPort: true,
      open: true,
      cors: true
    },

    build: {
      outDir: 'dist',
      sourcemap: enableSourceMaps ? true : false,
      chunkSizeWarningLimit: 1000,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
              passes: 2
            },
            mangle: {
              toplevel: true,
              safari10: true
            },
            format: {
              comments: false,
              preamble: `/* Qrius Platform - Production Build ${new Date().toISOString()} */`
            }
          }
        : undefined,

      rollupOptions: {
        plugins: [
          commonjs({
            include: [/formio-react/, /node_modules/],
            requireReturnsDefault: 'auto',
            esmExternals: true
          }),
          mode === 'analyze' &&
            visualizer({
              filename: 'dist/stats.html',
              open: true,
              gzipSize: true,
              brotliSize: true
            })
        ].filter(Boolean),
        output: {
          manualChunks: id => {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('formio-react/lib') || id.includes('node_modules/@formio/')) {
              return 'vendor-formio';
            }
            if (id.includes('node_modules')) {
              return 'vendor-libs';
            }
          },
          chunkFileNames: isProduction ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
          entryFileNames: isProduction ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
          assetFileNames: isProduction ? 'assets/[hash].[ext]' : 'assets/[name]-[hash].[ext]',
          // Ensure proper CommonJS named exports handling
          interop: 'auto',
          exports: 'named'
        }
      }
    },

    optimizeDeps: {
      include: ['react', 'react-dom', '@qrius/formio-react'],
      esbuildOptions: {
        // Ensure proper CommonJS to ESM conversion
        mainFields: ['module', 'main']
      }
    }
  };
});
