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
      // @uturi/sonification, @uturi/ui 모듈 대응(TODO: 워크플로우에서 빌드 순서 명시할 것)
      'import/no-unresolved': [
        'error',
        {
          ignore: ['@uturi/sonification', '@uturi/ui'],
        },
      ],
    },
  },
  {
    ignores: ['.next/**/*', 'node_modules/**/*', 'dist/**/*', 'out/**/*'],
  },
];
