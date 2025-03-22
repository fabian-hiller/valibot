import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import pluginSecurity from 'eslint-plugin-security';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  jsdoc.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  {
    files: ['lib/**/*.ts'],
    extends: [importPlugin.flatConfigs.recommended],
    plugins: { jsdoc },
    rules: {
      // Enable rules -----------------------------------------------------------

      // TypeScript
      '@typescript-eslint/consistent-type-definitions': 'off', // Enforce declaring types using `interface` keyword for better TS performance.
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

      // JSDoc
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',

      // Security
      'security/detect-object-injection': 'off', // Too many false positives
    },
  }
);
