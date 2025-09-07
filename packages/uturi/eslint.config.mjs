import eslintConfig from '@uturi/config-eslint';

export default [
  ...eslintConfig.configs.typescript,
  ...eslintConfig.configs.react,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    ignores: ['.next/**/*', 'node_modules/**/*', 'dist/**/*', 'out/**/*'],
  },
];
