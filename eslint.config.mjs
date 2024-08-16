import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/admin', '**/test', 'lib/env/tools.js', '**/gulpfile.js', 'eslint.config.mjs', 'test.js', 'test2.js'],
  },
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },

      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },

    rules: {
      'no-use-before-define': [
        'error',
        {
          functions: false,
        },
      ],

      'no-continue': 'off',

      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],
    },
  },
];
