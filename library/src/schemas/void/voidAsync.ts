import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  /**
   * The schema type.
   */
  type: 'void';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates an async void schema.
 *
 * @param message The error message.
 *
 * @returns An async void schema.
 */
export function voidAsync(message?: ErrorMessage): VoidSchemaAsync {
  return {
    type: 'void',
    expects: 'void',
    async: true,
    message,
    async _parse(input, config) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return schemaIssue(this, voidAsync, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;
