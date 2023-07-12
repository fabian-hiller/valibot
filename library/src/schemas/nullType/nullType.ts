import { ValiError } from '../../error';
import type { BaseSchema } from '../../types';

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
export function nullType(error?: string): NullSchema {
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
    parse(input, info) {
      // Check type of input
      if (input !== null) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'null',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Return output
      return input;
    },
  };
}
