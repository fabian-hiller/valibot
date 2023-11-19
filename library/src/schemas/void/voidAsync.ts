import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export interface VoidSchemaAsync<TOutput = void>
  extends BaseSchemaAsync<void, TOutput> {
  /**
   * The schema type.
   */
  type: 'void';
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates an async void schema.
 *
 * @param message The error message.
 *
 * @returns An async void schema.
 */
export function voidAsync(
  message: ErrorMessage = 'Invalid type'
): VoidSchemaAsync {
  return {
    type: 'void',
    async: true,
    message,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return getSchemaIssues(info, 'type', 'void', this.message, input);
      }

      // Return input as output
      return getOutput(input);
    },
  };
}

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;
