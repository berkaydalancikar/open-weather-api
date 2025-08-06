// eslint.config.cjs
import { defineConfig, globalIgnores } from 'eslint/config';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),

  // JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      unicorn,
      import: importPlugin,
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'import/order': ['error', { 'newlines-between': 'always' }],
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },

  // NestJS-specific and project-wide rules
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': 'warn',
      'unicorn/prefer-module': 'off',
    },
  },
]);