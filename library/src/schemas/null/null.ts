import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export interface NullSchema<TOutput = null> extends BaseSchema<null, TOutput> {
  /**
   * The schema type.
   */
  type: 'null';
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates a null schema.
 *
 * @param message The error message.
 *
 * @returns A null schema.
 */
export function null_(message: ErrorMessage = 'Invalid type'): NullSchema {
  return {
    type: 'null',
    async: false,
    message,
    _parse(input, info) {
      // Check type of input
      if (input !== null) {
        return getSchemaIssues(info, 'type', 'null', this.message, input);
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
