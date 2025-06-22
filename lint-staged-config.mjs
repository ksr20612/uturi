export default {
  '**/*.{ts,tsx,js,jsx,mjs}': [
    'prettier --write',
    'eslint --fix',
    'vitest --run --reporter=verbose',
  ],
  '**/*.{json,md,yaml,yml}': ['prettier --write'],
  '**/*.{css,scss}': ['prettier --write'],
};
