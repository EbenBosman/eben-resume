import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'build/**', 'public/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  prettierRecommended,
];

export default eslintConfig;
