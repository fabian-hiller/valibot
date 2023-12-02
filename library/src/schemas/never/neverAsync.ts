import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';

/**
 * Never schema async type.
 */
export type NeverSchemaAsync = BaseSchemaAsync<never> & {
  /**
   * The schema type.
   */
  type: 'never';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates an async never schema.
 *
 * @param message The error message.
 *
 * @returns An async never schema.
 */
export function neverAsync(
  message: ErrorMessage = 'Invalid type'
): NeverSchemaAsync {
  return {
    type: 'never',
    async: true,
    message,
    async _parse(input, info) {
      return schemaIssue(info, 'type', 'never', this.message, input);
    },
  };
}
