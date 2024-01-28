import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
};

/**
 * Creates an async NaN schema.
 *
 * @param message The error message.
 *
 * @returns An async NaN schema.
 */
export function nanAsync(message?: ErrorMessage): NanSchemaAsync {
  return {
    type: 'nan',
    expects: 'NaN',
    async: true,
    message,
    async _parse(input, config) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return schemaIssue(this, input, config);
      }

      // Return parse result
      return parseResult(true, input as number);
    },
  };
}
