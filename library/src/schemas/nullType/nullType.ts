import { getIssues } from '../../utils/index.ts';

import type { BaseSchema, FString } from '../../types.ts';
/**
 * Null schema type.
 */
export type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
  schema: 'null';
};

/**
 * Creates a null schema.
 *
 * @param error The error message.
 *
 * @returns A null schema.
 */
export function nullType(error?: FString): NullSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'null',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (input !== null) {
        return getIssues(info, 'type', 'null', error || 'Invalid type', input);
      }

      // Return input as output
      return { output: input };
    },
  };
}
