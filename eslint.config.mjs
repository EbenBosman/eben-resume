import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'build/**', 'public/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  prettierRecommended,
];

export default eslintConfig;
