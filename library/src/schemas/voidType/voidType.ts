import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
  kind: 'void';
};

/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
export function voidType(error?: ErrorMessage): VoidSchema {
  return {
    kind: 'void',
    async: false,
    _parse(input, info) {
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
