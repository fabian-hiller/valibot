import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
}

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
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, undefined_, input, config);
    },
  };
}

/**
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;
