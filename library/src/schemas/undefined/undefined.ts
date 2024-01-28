import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Undefined schema type.
 */
export type UndefinedSchema<TOutput = undefined> = BaseSchema<
  undefined,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'undefined';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates a undefined schema.
 *
 * @param message The error message.
 *
 * @returns A undefined schema.
 */
export function undefined_(message?: ErrorMessage): UndefinedSchema {
  return {
    type: 'undefined',
    expects: 'undefined',
    async: false,
    message,
    _parse(input, config) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return schemaIssue(this, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;
