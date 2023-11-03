import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
  type: 'null';
};

/**
 * Creates a null schema.
 *
 * @param error The error message.
 *
 * @returns A null schema.
 */
export function null_(error?: ErrorMessage): NullSchema {
  return {
    /**
     * The schema type.
     */
    type: 'null',

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
        return getSchemaIssues(
          info,
          'type',
          'null',
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
 * See {@link null_}
 *
 * @deprecated Use `null_` instead.
 */
export const nullType = null_;
