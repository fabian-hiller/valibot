import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
  /**
   * The schema type.
   */
  type: 'void';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates a void schema.
 *
 * @param message The error message.
 *
 * @returns A void schema.
 */
export function void_(message: ErrorMessage = 'Invalid type'): VoidSchema {
  return {
    type: 'void',
    async: false,
    message,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(info, 'type', 'void', this.message, input);
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
