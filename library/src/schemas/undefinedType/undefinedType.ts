import { getIssues } from '../../utils/index.ts';

import type { BaseSchema, FString } from '../../types.ts';
/**
 * Undefined schema type.
 */
export type UndefinedSchema<TOutput = undefined> = BaseSchema<
  undefined,
  TOutput
> & {
  schema: 'undefined';
};

/**
 * Creates a undefined schema.
 *
 * @param error The error message.
 *
 * @returns A undefined schema.
 */
export function undefinedType(error?: FString): UndefinedSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'undefined',

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
