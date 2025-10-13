import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const isProduction = process.env.NODE_ENV === 'production';

const external = ['@formio/js', 'react', 'react-dom', 'react/jsx-runtime'];

const isExternal = (id) => {
  return external.some((dep) => id.startsWith(dep));
};

const productionReplacements = isProduction
  ? {
      preventAssignment: true,
      include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      exclude: ['node_modules/**'],
      values: {
        '"@formio/js"': '"@internal/forms"',
        "'@formio/js'": "'@internal/forms'",
      },
    }
  : null;

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.esm.js',
      format: 'esm',
      sourcemap: !isProduction,
      exports: 'named',
    },
    external: isExternal,
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      json(),
      productionReplacements && replace(productionReplacements),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './lib',
        exclude: ['src/test-setup.ts', '**/*.test.ts', '**/*.spec.ts'],
      }),
      postcss({
        extract: 'styles.css',
        modules: false,
        sourceMap: !isProduction,
        minimize: isProduction,
      }),
      isProduction &&
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 2,
          },
          mangle: {
            toplevel: true,
          },
          format: {
            comments: false,
            preamble: `/* @formio/file-upload - Production Build */`,
          },
        }),
    ].filter(Boolean),
  },
  // UMD build (minified, for CDN)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/formio-file-upload.min.js',
      format: 'umd',
      name: isProduction ? 'QriusUpload' : 'FormioFileUpload',
      sourcemap: !isProduction,
      exports: 'named',
      globals: {
        '@formio/js': 'Formio',
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    external: ['@formio/js', 'react', 'react-dom'],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      json(),
      productionReplacements && replace(productionReplacements),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        exclude: ['src/test-setup.ts', '**/*.test.ts', '**/*.spec.ts'],
      }),
      postcss({
        extract: 'formio-file-upload.min.css',
        minimize: true,
      }),
      terser({
        compress: {
          drop_console: isProduction,
          drop_debugger: true,
          passes: isProduction ? 3 : 1,
        },
        mangle: isProduction
          ? {
              toplevel: true,
            }
          : false,
        format: {
          comments: false,
        },
      }),
    ].filter(Boolean),
  },
];
