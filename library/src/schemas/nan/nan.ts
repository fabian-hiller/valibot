import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * NaN schema type.
 */
export interface NanSchema<TOutput = number>
  extends BaseSchema<number, TOutput> {
  /**
   * The schema type.
   */
  type: 'nan';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
}

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
      // If type is valid, return schema result
      if (Number.isNaN(input)) {
        return schemaResult(true, input as number);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, nan, input, config);
    },
  };
}
