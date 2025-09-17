export default {
  '*.{ts,js,cjs,json,md}': 'prettier --write',
  'src/**/*.css': 'prettier --write',
  'src/**/*.{ts,tsx}': ['prettier --write', 'eslint --fix'],
};
