import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Never schema async type.
 */
export type NeverSchemaAsync = BaseSchemaAsync<never> & {
  type: 'never';
};

/**
 * Creates an async never schema.
 *
 * @param error The error message.
 *
 * @returns An async never schema.
 */
export function neverAsync(error?: ErrorMessage): NeverSchemaAsync {
  return {
    type: 'never',
    async: true,
    async _parse(input, info) {
      return getSchemaIssues(
        info,
        'type',
        'never',
        error || 'Invalid type',
        input
      );
    },
  };
}
