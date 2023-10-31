import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * NaN schema async type.
 */
export type NanSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
  type: 'nan';
};

/**
 * Creates an async NaN schema.
 *
 * @param error The error message.
 *
 * @returns An async NaN schema.
 */
export function nanAsync(error?: ErrorMessage): NanSchemaAsync {
  return {
    type: 'nan',
    async: true,
    async _parse(input, info) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return getSchemaIssues(
          info,
          'type',
          'nan',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as number);
    },
  };
}
