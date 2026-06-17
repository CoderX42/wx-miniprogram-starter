module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-console': 'off',
    'prefer-const': 'warn',
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: { jest: true, node: true },
    },
    {
      files: ['packages/core/src/**/*.js'],
      env: { browser: true, node: true },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'miniprogram_npm/',
    'unpackage/',
    'docs/.vitepress/',
    '**/iconfont/',
  ],
};
