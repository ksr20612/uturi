import eslintConfig from '@uturi/config-eslint';

export default [
  ...eslintConfig.configs.react,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['*.ts', '*.mjs', '.storybook/**/*.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
