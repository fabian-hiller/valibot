import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
  type: 'void';
};

/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
export function void_(error?: ErrorMessage): VoidSchema {
  return {
    type: 'void',
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

/**
 * See {@link void_}
 *
 * @deprecated Use `void_` instead.
 */
export const voidType = void_;
