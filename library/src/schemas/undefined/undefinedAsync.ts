import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
}

/**
 * Creates an async undefined schema.
 *
 * @param message The error message.
 *
 * @returns An async undefined schema.
 */
export function undefinedAsync(message?: ErrorMessage): UndefinedSchemaAsync {
  return {
    type: 'undefined',
    expects: 'undefined',
    async: true,
    message,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, undefinedAsync, input, config);
    },
  };
}

/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
export const undefinedTypeAsync = undefinedAsync;
