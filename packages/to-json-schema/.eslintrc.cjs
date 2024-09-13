module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended-typescript-error',
    'plugin:security/recommended-legacy',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // Enable rules -----------------------------------------------------------

    // TypeScript
    '@typescript-eslint/consistent-type-definitions': 'error', // Enforce declaring types using `interface` keyword for better TS performance.
    '@typescript-eslint/consistent-type-imports': 'warn',

    // Import
    'import/extensions': ['error', 'always'], // Require file extensions

    // JSDoc
    'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
    'jsdoc/sort-tags': [
      'error',
      {
        linesBetween: 1,
        tagSequence: [
          { tags: ['deprecated'] },
          { tags: ['param'] },
          { tags: ['returns'] },
        ],
      },
    ],
    // NOTE: For overloads functions, we only require a JSDoc at the top
    // SEE: https://github.com/gajus/eslint-plugin-jsdoc/issues/666
    'jsdoc/require-jsdoc': [
      'error',
      {
        contexts: [
          'ExportNamedDeclaration[declaration.type="TSDeclareFunction"]:not(ExportNamedDeclaration[declaration.type="TSDeclareFunction"] + ExportNamedDeclaration[declaration.type="TSDeclareFunction"])',
          'ExportNamedDeclaration[declaration.type="FunctionDeclaration"]:not(ExportNamedDeclaration[declaration.type="TSDeclareFunction"] + ExportNamedDeclaration[declaration.type="FunctionDeclaration"])',
        ],
        require: {
          FunctionDeclaration: false,
        },
      },
    ],

    // Disable rules ----------------------------------------------------------

    // TypeScript
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // Imports
    'no-duplicate-imports': 'off',

    // Security
    'security/detect-object-injection': 'off', // Too many false positives
  },
};
