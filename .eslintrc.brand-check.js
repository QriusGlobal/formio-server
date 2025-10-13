module.exports = {
  root: true,

  plugins: ['./eslint-plugin-brand-security'],

  extends: ['./.eslintrc.js'],

  rules: {
    'brand-security/no-brand-references': 'error',
    'brand-security/no-production-secrets': 'error',
    'brand-security/no-source-map-references': 'error',
    'brand-security/no-debug-artifacts': 'warn',

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': 'error'
  },

  overrides: [
    {
      files: [
        '**/node_modules/**',
        '**/*.config.js',
        '**/webpack*.js',
        'scripts/**/*.js',
        '**/*.test.js',
        '**/*.spec.js',
        '**/test/**/*.js',
        '**/tests/**/*.js',
        'package.json',
        'package-lock.json',
        'pnpm-lock.yaml'
      ],
      rules: {
        'brand-security/no-brand-references': 'off',
        'brand-security/no-production-secrets': 'off',
        'brand-security/no-source-map-references': 'off',
        'brand-security/no-debug-artifacts': 'off'
      }
    },
    {
      files: [
        'formio/**/*.js',
        'formio-core/**/*.js',
        'formio-react/**/*.js',
        'packages/*/src/**/*.{js,ts,tsx}'
      ],
      rules: {
        'brand-security/no-brand-references': 'off'
      }
    }
  ],

  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.nyc_output/',
    '*.min.js',
    'vendor/',
    'formio/portal/dist/',
    'formio/src/vm/bundles/',
    '**/out/',
    '.git/',
    'eslint-plugin-brand-security/',
    'docs/',
    'CLAUDE.md',
    'README.md',
    '*.lock',
    'patches/'
  ]
};
