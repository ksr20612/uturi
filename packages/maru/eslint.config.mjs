import eslintConfig from '@uturi/config-eslint';

export default [
  ...eslintConfig.configs.typescript,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'vite.config.ts'],
  },
];
