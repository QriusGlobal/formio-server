// eslint.config.js - ESLint 9.17.0 Flat Config
// Enterprise-grade configuration for React 19 + TypeScript 5.3+ + Node.js 20+

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import security from 'eslint-plugin-security';
import noSecrets from 'eslint-plugin-no-secrets';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import promisePlugin from 'eslint-plugin-promise';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import prettierConfig from 'eslint-config-prettier';

export default [
  // ========================================================================
  // GLOBAL IGNORES - Applied to all configurations
  // ========================================================================
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/lib/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/.cache/**',
      '**/out/**',
      '**/*.min.js',
      '**/*.bundle.js',
      '**/public/**',
      '**/static/**',
      '**/.git/**',
      '**/terraform/**/.terraform/**',
      '**/formio/node_modules/**',
      '**/formio-core/node_modules/**',
      '**/formio-react/node_modules/**',
      '**/.tasks/**',
      '**/.tmp-fork-fix/**',
      '**/eslint.config.js',
      '**/rollup.config.js',
      '**/jest.config.js',
      '**/playwright.config.ts',
      'formio-react/**'
    ]
  },

  // ========================================================================
  // BASE CONFIGURATION - JavaScript/TypeScript files
  // ========================================================================
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './form-client-web-app/tsconfig.json',
          './test-app/tsconfig.json',
          './tests/tsconfig.json'
        ],
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
        global: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        // ES2020+ globals
        globalThis: 'readonly',
        BigInt: 'readonly',
        // Test globals (for files not in test directories)
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      security,
      'no-secrets': noSecrets,
      'no-unsanitized': noUnsanitized,
      sonarjs,
      unicorn,
      promise: promisePlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11y
    },
    settings: {
      react: {
        version: '19'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [
            './tsconfig.json',
            './packages/*/tsconfig.json',
            './form-client-web-app/tsconfig.json',
            './test-app/tsconfig.json',
            './tests/tsconfig.json'
          ]
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']
        }
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      }
    },
    rules: {
      // ========================================================================
      // SECURITY RULES - All as errors (security-first approach)
      // ========================================================================
      // eslint-plugin-security
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn', // Warn - common pattern in build tools
      'security/detect-non-literal-require': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-new-buffer': 'error',

      // eslint-plugin-no-secrets - Prevent secrets in code
      'no-secrets/no-secrets': [
        'error',
        { tolerance: 4.5, ignoreContent: '^REACT_APP_', ignoreModules: true }
      ],

      // eslint-plugin-no-unsanitized - XSS prevention
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',

      // ========================================================================
      // TYPESCRIPT RULES - Basic syntax only (strict typing disabled)
      // ========================================================================
      // Type Safety Rules - DISABLED (user decision: no strict typing yet)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',

      // Basic TypeScript Rules - KEPT
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true
        }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        },
        {
          selector: 'enum',
          format: ['PascalCase']
        },
        {
          selector: 'class',
          format: ['PascalCase']
        }
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // ========================================================================
      // REACT RULES - React 19 + Performance
      // ========================================================================
      'react/react-in-jsx-scope': 'off', // Not needed in React 19
      'react/prop-types': 'off', // TypeScript handles this
      'react/jsx-uses-react': 'off', // Not needed in React 19
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-unescaped-entities': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/no-unstable-nested-components': 'error', // Performance critical
      'react/jsx-no-constructed-context-values': 'error', // Performance critical

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh (Vite HMR)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ========================================================================
      // ACCESSIBILITY RULES - WCAG 2.1 Level A
      // ========================================================================
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',

      // ========================================================================
      // CODE QUALITY RULES - SonarJS cognitive complexity
      // ========================================================================
      'sonarjs/cognitive-complexity': ['error', 15], // Max cognitive complexity
      'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-nested-template-literals': 'warn',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-small-switch': 'warn',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/prefer-object-literal': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',

      // ========================================================================
      // IMPORT MANAGEMENT - Circular dependency detection
      // ========================================================================
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }], // Circular deps
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.{ts,tsx,js,jsx}',
            '**/*.spec.{ts,tsx,js,jsx}',
            '**/tests/**',
            '**/test/**',
            '**/__tests__/**',
            '**/e2e/**',
            '**/playwright.config.ts',
            '**/vitest.config.ts',
            '**/jest.config.js',
            '**/vite.config.ts',
            '**/rollup.config.js',
            '**/eslint.config.js'
          ]
        }
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/newline-after-import': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',

      // ========================================================================
      // PROMISE RULES
      // ========================================================================
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/no-new-statics': 'error',
      'promise/valid-params': 'error',

      // ========================================================================
      // UNICORN RULES - Modern JavaScript practices
      // ========================================================================
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': 'error',
      'unicorn/consistent-destructuring': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true
          },
          ignore: ['CLAUDE.md', 'README.md', 'CHANGELOG.md', 'LICENSE', 'Makefile']
        }
      ],
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-array-for-each': 'warn', // Prefer for...of
      'unicorn/no-array-push-push': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-for-loop': 'warn',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-null': 'off', // TypeScript allows null
      'unicorn/no-useless-undefined': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-node-protocol': 'error', // Use node: prefix
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/throw-new-error': 'error',

      // ========================================================================
      // CORE ESLINT RULES
      // ========================================================================
      ...js.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'object-shorthand': 'error',
      'no-param-reassign': ['error', { props: true }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',
      'require-await': 'off', // Disabled - conflicts with @typescript-eslint/require-await
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error'
    }
  },

  // ========================================================================
  // TEST FILES OVERRIDE - Jest, Testing Library, Playwright
  // ========================================================================
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/tests/**/*.{ts,tsx,js,jsx}',
      '**/test/**/*.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/e2e/**/*.{ts,tsx,js,jsx}'
    ],
    plugins: {
      jest,
      'jest-dom': jestDom,
      'testing-library': testingLibrary
    },
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      // Disable type safety rules for tests (matches main config)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'import/no-extraneous-dependencies': 'off',

      // Jest rules
      'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
      'jest/expect-expect': 'error',
      'jest/no-alias-methods': 'error',
      'jest/no-commented-out-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-done-callback': 'error',
      'jest/no-duplicate-hooks': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-interpolation-in-snapshots': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-mocks-import': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/prefer-to-be': 'error',
      'jest/prefer-to-contain': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',

      // Jest DOM
      'jest-dom/prefer-checked': 'error',
      'jest-dom/prefer-enabled-disabled': 'error',
      'jest-dom/prefer-focus': 'error',
      'jest-dom/prefer-required': 'error',
      'jest-dom/prefer-to-have-attribute': 'error',
      'jest-dom/prefer-to-have-class': 'error',
      'jest-dom/prefer-to-have-style': 'error',
      'jest-dom/prefer-to-have-text-content': 'error',
      'jest-dom/prefer-to-have-value': 'error',

      // Testing Library
      'testing-library/await-async-queries': 'error',
      'testing-library/await-async-utils': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-container': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': ['error', 'react'],
      'testing-library/no-node-access': 'error',
      'testing-library/no-promise-in-fire-event': 'error',
      'testing-library/no-render-in-lifecycle': 'error',
      'testing-library/no-unnecessary-act': 'error',
      'testing-library/no-wait-for-multiple-assertions': 'error',
      'testing-library/no-wait-for-snapshot': 'error',
      'testing-library/prefer-find-by': 'error',
      'testing-library/prefer-presence-queries': 'error',
      'testing-library/prefer-screen-queries': 'error',
      'testing-library/render-result-naming-convention': 'error'
    }
  },

  // ========================================================================
  // CONFIGURATION FILES OVERRIDE - Relaxed rules
  // ========================================================================
  {
    files: [
      '*.config.{js,ts,mjs,cjs}',
      '**/config/**/*.{js,ts}',
      '**/scripts/**/*.{js,ts}',
      'eslint.config.js',
      'vite.config.ts',
      'vitest.config.ts',
      'playwright.config.ts',
      'rollup.config.js',
      'jest.config.js'
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-extraneous-dependencies': 'off',
      'unicorn/prefer-module': 'off',
      'no-console': 'off'
    }
  },

  // ========================================================================
  // LEGACY JAVASCRIPT FILES OVERRIDE - No TypeScript rules
  // ========================================================================
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      // Omit parser to use ESLint's default JavaScript parser
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module'
      }
    },
    rules: {
      // Disable ALL TypeScript-specific rules for JS files
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },

  // ========================================================================
  // PRETTIER COMPATIBILITY - Must be last to override formatting rules
  // ========================================================================
  prettierConfig
];
