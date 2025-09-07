import reactConfig from '@uturi/config-eslint/react/react.mjs';
import typescriptConfig from '@uturi/config-eslint/typescript/typescript.mjs';

export default [
  ...typescriptConfig,
  ...reactConfig,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      // vanilla-extract .css.ts 대응
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['*.ts', '*.mjs', '.storybook/**/*.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
