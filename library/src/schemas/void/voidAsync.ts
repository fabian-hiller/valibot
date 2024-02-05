import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
}

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
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, voidAsync, input, config);
    },
  };
}

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;
