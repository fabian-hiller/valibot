import { ValiError } from '../../error/index.ts';
import type { BaseSchema } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
  schema: 'void';
};

/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
export function voidType(error?: string): VoidSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'void',

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
      if (typeof input !== 'undefined') {
        throw new ValiError([
          getIssue(info, {
            reason: 'type',
            validation: 'void',
            message: error || 'Invalid type',
            input,
          }),
        ]);
      }

      // Return output
      return input;
    },
  };
}
