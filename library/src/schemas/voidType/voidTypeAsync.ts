import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  kind: 'void';
};

/**
 * Creates an async void schema.
 *
 * @param error The error message.
 *
 * @returns An async void schema.
 */
export function voidTypeAsync(error?: ErrorMessage): VoidSchemaAsync {
  return {
    kind: 'void',
    async: true,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(
          info,
          'type',
          'void',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input);
    },
  };
}
