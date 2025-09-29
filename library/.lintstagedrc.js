export default {
  '*.{ts,js,json,md}': 'prettier --write',
  'src/**/*.ts': ['prettier --write', 'eslint --fix'],
};
