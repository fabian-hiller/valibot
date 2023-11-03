import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  type: 'void';
};

/**
 * Creates an async void schema.
 *
 * @param error The error message.
 *
 * @returns An async void schema.
 */
export function voidAsync(error?: ErrorMessage): VoidSchemaAsync {
  return {
    /**
     * The schema type.
     */
    type: 'void',

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

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;
