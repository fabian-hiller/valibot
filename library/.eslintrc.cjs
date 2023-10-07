module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:regexp/recommended',
    'canonical/regexp',
    'plugin:security/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'unicorn'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-duplicate-imports': 'off',
    'import/extensions': ['error', 'always'],

    'security/detect-object-injection': 'off', // too many false positives

    // regexp rules not turned on by regexp/recommend and canonical/regexp
    // avoid unneeded regexps characters / style
    'regexp/no-control-character': 'error',
    'regexp/no-octal': 'error',
    'regexp/no-standalone-backslash': 'error',
    'regexp/prefer-escape-replacement-dollar-char': 'error',
    'regexp/prefer-quantifier': 'error',
    'regexp/hexadecimal-escape': ['error', 'always'],
    'regexp/sort-alternatives': 'error',

    'regexp/no-super-linear-move': 'error', // prevent DoS regexps
    'regexp/require-unicode-regexp': 'error', // /u flag is faster and enables regexp strict mode
    'regexp/prefer-regexp-exec': 'error', // enforce that RegExp#exec is used instead of String#match if no global flag is provided, as exec is faster
    'unicorn/better-regex': 'error', // auto-optimize regexps
    'unicorn/prefer-regexp-test': 'error', // RegExp#test is fastest
    // 'unicorn/prefer-string-replace-all': 'warn', // String#replaceAll avoids the need for resetting lastIndex when using cached global regex
    'unicorn/prefer-string-starts-ends-with': 'error', // RegExp#startsWith and RegExp#endsWith are faster
  },
};
