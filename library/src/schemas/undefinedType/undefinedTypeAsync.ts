import { getIssues } from '../../utils/index.ts';

import type { BaseSchemaAsync, FString } from '../../types.ts';
/**
 * Undefined schema async type.
 */
export type UndefinedSchemaAsync<TOutput = undefined> = BaseSchemaAsync<
  undefined,
  TOutput
> & {
  schema: 'undefined';
};

/**
 * Creates an async undefined schema.
 *
 * @param error The error message.
 *
 * @returns An async undefined schema.
 */
export function undefinedTypeAsync(error?: FString): UndefinedSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'undefined',

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
        return getIssues(
          info,
          'type',
          'undefined',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return { output: input };
    },
  };
}
