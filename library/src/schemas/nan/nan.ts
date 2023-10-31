import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * NaN schema type.
 */
export type NanSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  type: 'nan';
};

/**
 * Creates a NaN schema.
 *
 * @param error The error message.
 *
 * @returns A NaN schema.
 */
export function nan(error?: ErrorMessage): NanSchema {
  return {
    type: 'nan',
    async: false,
    _parse(input, info) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return getSchemaIssues(
          info,
          'type',
          'nan',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as number);
    },
  };
}
