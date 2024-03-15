import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * NaN schema async type.
 */
export interface NanSchemaAsync<TOutput = number>
  extends BaseSchemaAsync<number, TOutput> {
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
      // If type is valid, return schema result
      if (Number.isNaN(input)) {
        return schemaResult(true, input as number);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, nanAsync, input, config);
    },
  };
}
