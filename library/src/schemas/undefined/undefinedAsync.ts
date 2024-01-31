import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Undefined schema async type.
 */
export type UndefinedSchemaAsync<TOutput = undefined> = BaseSchemaAsync<
  undefined,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'undefined';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

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
      // Check type of input
      if (typeof input !== 'undefined') {
        return schemaIssue(this, undefinedAsync, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
export const undefinedTypeAsync = undefinedAsync;
