import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * NaN schema async type.
 */
export type NanSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'nan';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates an async NaN schema.
 *
 * @param message The error message.
 *
 * @returns An async NaN schema.
 */
export function nanAsync(
  message: ErrorMessage = 'Invalid type'
): NanSchemaAsync {
  return {
    type: 'nan',
    async: true,
    message,
    async _parse(input, info) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return getSchemaIssues(info, 'type', 'nan', this.message, input);
      }

      // Return input as output
      return getOutput(input as number);
    },
  };
}
