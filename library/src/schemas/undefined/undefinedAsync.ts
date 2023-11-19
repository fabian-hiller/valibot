import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Undefined schema async type.
 */
export interface UndefinedSchemaAsync<TOutput = undefined>
  extends BaseSchemaAsync<undefined, TOutput> {
  /**
   * The schema type.
   */
  type: 'undefined';
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates an async undefined schema.
 *
 * @param message The error message.
 *
 * @returns An async undefined schema.
 */
export function undefinedAsync(
  message: ErrorMessage = 'Invalid type'
): UndefinedSchemaAsync {
  return {
    type: 'undefined',
    async: true,
    message,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(info, 'type', 'undefined', this.message, input);
      }

      // Return input as output
      return getOutput(input);
    },
  };
}

/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
export const undefinedTypeAsync = undefinedAsync;
