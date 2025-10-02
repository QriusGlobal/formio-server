import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const external = [
  '@formio/js',
  'react',
  'react-dom',
  'react/jsx-runtime'
];

const isExternal = (id) => {
  return external.some(dep => id.startsWith(dep));
};

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    external: isExternal,
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './lib'
      }),
      postcss({
        extract: 'styles.css',
        modules: false,
        sourceMap: true,
        minimize: true
      })
    ]
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external: isExternal,
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      postcss({
        extract: false,
        inject: true,
        modules: false
      })
    ]
  },
  // UMD build (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/formio-file-upload.min.js',
      format: 'umd',
      name: 'FormioFileUpload',
      sourcemap: true,
      globals: {
        '@formio/js': 'Formio',
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    },
    external: ['@formio/js', 'react', 'react-dom'],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      postcss({
        extract: 'formio-file-upload.min.css',
        minimize: true
      }),
      terser()
    ]
  }
];