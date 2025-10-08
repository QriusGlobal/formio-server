/**
 * ESLint Configuration for Form.io Monorepo
 * Enforces consistent code quality across all JavaScript/TypeScript projects
 */

module.exports = {
  root: true,

  // Base configurations
  extends: [
    'eslint:recommended',
    '@eslint-community/recommended',
  ],

  // Environment settings
  env: {
    node: true,
    es2022: true,
    mocha: true,
  },

  // Global variables
  globals: {
    process: 'readonly',
    Buffer: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    module: 'readonly',
    require: 'readonly',
    exports: 'readonly',
    global: 'readonly',
    console: 'readonly',
  },

  // Parser options
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },

  // Rules
  rules: {
    // Error prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-void': 'error',
    'no-with': 'error',

    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'dot-notation': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'warn',
    'no-magic-numbers': ['warn', {
      ignore: [-1, 0, 1, 2, 100, 1000],
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true
    }],
    'no-multi-spaces': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'prefer-promise-reject-errors': 'error',
    'radix': 'error',
    'require-await': 'error',
    'yoda': 'error',

    // Variable rules
    'no-delete-var': 'error',
    'no-label-var': 'error',
    'no-restricted-globals': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'no-undef': 'error',
    'no-undef-init': 'warn',
    'no-undefined': 'off',
    'no-use-before-define': ['error', {
      functions: false,
      classes: true,
      variables: true
    }],
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],

    // Style rules
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'camelcase': ['error', { properties: 'never' }],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'consistent-this': ['error', 'self'],
    'eol-last': 'error',
    'func-call-spacing': 'error',
    'indent': ['error', 2, {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: { parameters: 1, body: 1 },
      FunctionExpression: { parameters: 1, body: 1 },
      CallExpression: { arguments: 1 },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoreComments: false
    }],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'line-comment-position': 'error',
    'lines-around-comment': 'error',
    'max-depth': ['warn', 4],
    'max-len': ['warn', {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    'max-nested-callbacks': ['warn', 3],
    'max-params': ['warn', 5],
    'max-statements-per-line': ['error', { max: 1 }],
    'new-cap': 'error',
    'new-parens': 'error',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
    'no-array-constructor': 'error',
    'no-bitwise': 'warn',
    'no-continue': 'warn',
    'no-inline-comments': 'off',
    'no-lonely-if': 'error',
    'no-mixed-operators': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'no-negated-condition': 'warn',
    'no-nested-ternary': 'error',
    'no-new-object': 'error',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-spacing': ['error', 'always'],
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'error',
    'operator-linebreak': ['error', 'after'],
    'padded-blocks': ['error', 'never'],
    'quote-props': ['error', 'as-needed'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'unicode-bom': ['error', 'never'],

    // ES6+ rules
    'arrow-body-style': 'error',
    'arrow-parens': 'error',
    'arrow-spacing': 'error',
    'constructor-super': 'error',
    'generator-star-spacing': 'error',
    'no-class-assign': 'error',
    'no-confusing-arrow': 'error',
    'no-const-assign': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'no-new-symbol': 'error',
    'no-restricted-imports': 'off',
    'no-this-before-super': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'require-yield': 'error',
    'rest-spread-spacing': 'error',
    'sort-imports': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'yield-star-spacing': 'error',

    // Async/await rules
    'require-atomic-updates': 'off',
    'no-return-assign': 'error',
  },

  // Override rules for specific files
  overrides: [
    {
      // Form.io server specific rules
      files: ['formio/**/*.js'],
      env: {
        node: true,
        mocha: true,
      },
      rules: {
        'no-magic-numbers': 'off', // Form.io uses many magic numbers
        'max-len': ['warn', { code: 140 }], // Slightly longer for formio
        'no-process-exit': 'off', // Form.io uses process.exit
        'camelcase': 'off', // Form.io uses snake_case in some places
      }
    },
    {
      // Test files
      files: ['**/*.test.js', '**/*.spec.js', '**/test/**/*.js'],
      env: {
        mocha: true,
        node: true,
      },
      rules: {
        'no-magic-numbers': 'off',
        'max-len': 'off',
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        'handle-callback-err': 'off',
      }
    },
    {
      // Terraform files (HCL)
      files: ['**/*.tf', '**/*.tfvars'],
      parser: 'terraform-parser',
      plugins: ['@terraform'],
      extends: ['plugin:@terraform/recommended'],
      rules: {
        '@terraform/plugin/terraform-comment-syntax': 'error',
        '@terraform/plugin/terraform-naming': 'error',
        '@terraform/plugin/terraform-required-providers': 'error',
        '@terraform/plugin/terraform-required-version': 'error',
        '@terraform/plugin/terraform-workspace-locals': 'error',
        '@terraform/plugin/terraform-deprecated-interpolation': 'error',
        '@terraform/plugin/terraform-unused-declarations': 'error',
        '@terraform/plugin/terraform-docs': 'off',
      }
    },
    {
      // Configuration files
      files: ['**/*.config.js', '**/webpack*.js'],
      env: {
        node: true,
      },
      rules: {
        'no-magic-numbers': 'off',
      }
    },
    {
      // Scripts and tools
      files: ['scripts/**/*.js', 'tools/**/*.js'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
      }
    }
  ],

  // Ignore patterns
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
  ]
};