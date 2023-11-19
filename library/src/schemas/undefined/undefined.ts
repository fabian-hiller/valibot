import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Undefined schema type.
 */
export interface UndefinedSchema<TOutput = undefined>
  extends BaseSchema<undefined, TOutput> {
  /**
   * The schema type.
   */
  type: 'undefined';
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates a undefined schema.
 *
 * @param message The error message.
 *
 * @returns A undefined schema.
 */
export function undefined_(
  message: ErrorMessage = 'Invalid type'
): UndefinedSchema {
  return {
    type: 'undefined',
    async: false,
    message,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(info, 'type', 'undefined', this.message, input);
      }

      // Return input as output
      return getOutput(input);
    },
  };
}

/**
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;
