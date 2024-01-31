import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * NaN schema type.
 */
export type NanSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  /**
   * The schema type.
   */
  type: 'nan';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates a NaN schema.
 *
 * @param message The error message.
 *
 * @returns A NaN schema.
 */
export function nan(message?: ErrorMessage): NanSchema {
  return {
    type: 'nan',
    expects: 'NaN',
    async: false,
    message,
    _parse(input, config) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return schemaIssue(this, nan, input, config);
      }

      // Return parse result
      return parseResult(true, input as number);
    },
  };
}
