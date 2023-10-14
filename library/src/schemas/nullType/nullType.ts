import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
  kind: 'null';
};

/**
 * Creates a null schema.
 *
 * @param error The error message.
 *
 * @returns A null schema.
 */
export function nullType(error?: ErrorMessage): NullSchema {
  return {
    kind: 'null',
    async: false,
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
