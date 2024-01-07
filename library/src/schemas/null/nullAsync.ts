import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export interface NullSchemaAsync<TOutput = null>
  extends BaseSchemaAsync<null, TOutput> {
  /**
   * The schema type.
   */
  type: 'null';
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates an async null schema.
 *
 * @param message The error message.
 *
 * @returns An async null schema.
 */
export function nullAsync(
  message: ErrorMessage = 'Invalid type'
): NullSchemaAsync {
  return {
    type: 'null',
    async: true,
    message,
    async _parse(input, info) {
      // Check type of input
      if (input !== null) {
        return schemaIssue(info, 'type', 'null', this.message, input);
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
