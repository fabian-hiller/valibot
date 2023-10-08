import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Never schema async type.
 */
export type NeverSchemaAsync = BaseSchemaAsync<never> & {
  schema: 'never';
};

/**
 * Creates an async never schema.
 * @param error The error message.
 * @returns An async never schema.
 */
export function neverAsync(error?: ErrorMessage): NeverSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'never',

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     * @param input The input to be parsed.
     * @param info The parse info.
     * @returns The parsed output.
     */
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
