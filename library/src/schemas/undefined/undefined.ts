import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Undefined schema type.
 */
export type UndefinedSchema<TOutput = undefined> = BaseSchema<
  undefined,
  TOutput
> & {
  type: 'undefined';
};

/**
 * Creates a undefined schema.
 *
 * @param error The error message.
 *
 * @returns A undefined schema.
 */
export function undefined_(error?: ErrorMessage): UndefinedSchema {
  return {
    type: 'undefined',
    async: false,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(
          info,
          'type',
          'undefined',
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
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;
