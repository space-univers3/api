import antfu from '@antfu/eslint-config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default antfu(
  {
    react: false,
    typescript: true,
    jsonc: false,

    lessOpinionated: true,
    isInEditor: false,

    stylistic: {
      semi: true,
    },

    formatters: {
      css: false,
      json: false,
    },
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
  },
  {
    rules: {
      'import/order': 'off', // Avoid conflicts with `simple-import-sort` plugin
      'sort-imports': 'off', // Avoid conflicts with `simple-import-sort` plugin

      'ts/consistent-type-definitions': 'off',
      'ts/consistent-type-imports': 'off',
      'node/prefer-global/process': 'off', // Allow using `process.env`
    },
  },
);
