module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs', 'denoVitestPolyfill.ts'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended-typescript-error',
    'plugin:regexp/recommended',
    'plugin:security/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'redos-detector'],
  rules: {
    // Enable rules -----------------------------------------------------------

    // Import
    'import/extensions': ['error', 'always'], // Require file extensions

    // Regexp
    'regexp/no-super-linear-move': 'error', // Prevent DoS regexps
    'regexp/no-control-character': 'error', // Avoid unneeded regexps characters
    'regexp/no-octal': 'error', // Avoid unneeded regexps characters
    'regexp/no-standalone-backslash': 'error', // Avoid unneeded regexps characters
    'regexp/prefer-escape-replacement-dollar-char': 'error', // Avoid unneeded regexps characters
    'regexp/prefer-quantifier': 'error', // Avoid unneeded regexps characters
    'regexp/hexadecimal-escape': ['error', 'always'], // Avoid unneeded regexps characters
    'regexp/sort-alternatives': 'error', // Avoid unneeded regexps characters
    'regexp/require-unicode-regexp': 'error', // /u flag is faster and enables regexp strict mode
    'regexp/prefer-regexp-exec': 'error', // Enforce that RegExp#exec is used instead of String#match if no global flag is provided, as exec is faster

    // TypeScript
    '@typescript-eslint/consistent-type-definitions': 'error', // Enforce declaring types using `interface` keyword for better TS performance.

    // Redos detector
    'redos-detector/no-unsafe-regex': ['error', { ignoreError: true }], // Prevent DoS regexps

    // Disable rules ----------------------------------------------------------

    // Default
    'no-duplicate-imports': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // Imports
    'no-duplicate-imports': 'off',
    'import/extensions': ['error', 'always'],

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

    // Security
    'security/detect-object-injection': 'off', // Too many false positives
    'security/detect-unsafe-regex': 'off', // Too many false positives, see https://github.com/eslint-community/eslint-plugin-security/issues/28 - we use the redos-detector plugin instead
  },
};
