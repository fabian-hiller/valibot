export default {
  '*.{ts,js,cjs,json,md}': 'prettier --write',
  'src/**/*.{css,mdx}': 'prettier --write',
  'src/**/*.{ts,tsx}': ['prettier --write', 'eslint --fix'],
};
