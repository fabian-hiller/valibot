import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export type NullSchemaAsync<TOutput = null> = BaseSchemaAsync<null, TOutput> & {
  /**
   * The schema type.
   */
  type: 'null';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates an async null schema.
 *
 * @param message The error message.
 *
 * @returns An async null schema.
 */
export function nullAsync(message?: ErrorMessage): NullSchemaAsync {
  return {
    type: 'null',
    expects: 'null',
    async: true,
    message,
    async _parse(input, config) {
      // Check type of input
      if (input !== null) {
        return schemaIssue(this, nullAsync, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link nullAsync}
 *
 * @deprecated Use `nullAsync` instead.
 */
export const nullTypeAsync = nullAsync;
