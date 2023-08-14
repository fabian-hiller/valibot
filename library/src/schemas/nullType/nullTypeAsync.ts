import type { BaseSchemaAsync } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export type NullSchemaAsync<TOutput = null> = BaseSchemaAsync<null, TOutput> & {
  schema: 'null';
};

/**
 * Creates an async null schema.
 *
 * @param error The error message.
 *
 * @returns An async null schema.
 */
export function nullTypeAsync(error?: string): NullSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'null',

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
      if (input !== null) {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'null',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Return input as output
      return { output: input };
    },
  };
}
