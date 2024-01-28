import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
  /**
   * The schema type.
   */
  type: 'null';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates a null schema.
 *
 * @param message The error message.
 *
 * @returns A null schema.
 */
export function null_(message?: ErrorMessage): NullSchema {
  return {
    type: 'null',
    expects: 'null',
    async: false,
    message,
    _parse(input, config) {
      // Check type of input
      if (input !== null) {
        return schemaIssue(this, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link null_}
 *
 * @deprecated Use `null_` instead.
 */
export const nullType = null_;
