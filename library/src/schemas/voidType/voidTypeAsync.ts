import { getIssues } from '../../utils/index.ts';

import type { BaseSchemaAsync, FString } from '../../types.ts';
/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  schema: 'void';
};

/**
 * Creates an async void schema.
 *
 * @param error The error message.
 *
 * @returns An async void schema.
 */
export function voidTypeAsync(error?: FString): VoidSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'void',

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getIssues(info, 'type', 'void', error || 'Invalid type', input);
      }

      // Return input as output
      return { output: input };
    },
  };
}
