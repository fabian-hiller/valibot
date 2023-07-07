import { ValiError } from '../error';
import type { BaseSchemaAsync } from '../types';

/**
 * Never schema async type.
 */
export type NeverSchemaAsync = BaseSchemaAsync<never> & {
  schema: 'never';
};

/**
 * Creates an async never schema.
 *
 * @param error The error message.
 *
 * @returns An async never schema.
 */
export function neverAsync(error?: string): NeverSchemaAsync {
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
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async parse(input, info) {
      throw new ValiError([
        {
          reason: 'type',
          validation: 'never',
          origin: 'value',
          message: error || 'Invalid type',
          input,
          ...info,
        },
      ]);
    },
  };
}
