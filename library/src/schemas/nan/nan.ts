import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

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
  message: ErrorMessage;
}

/**
 * Creates a NaN schema.
 *
 * @param message The error message.
 *
 * @returns A NaN schema.
 */
export function nan(message: ErrorMessage = 'Invalid type'): NanSchema {
  return {
    type: 'nan',
    async: false,
    message,
    _parse(input, info) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return getSchemaIssues(info, 'type', 'nan', this.message, input);
      }

      // Return input as output
      return getOutput(input as number);
    },
  };
}
