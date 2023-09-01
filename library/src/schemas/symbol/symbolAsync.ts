import { getIssues } from '../../utils/index.ts';

import type { BaseSchemaAsync, FString } from '../../types.ts';
/**
 * Symbol schema async type.
 */
export type SymbolSchemaAsync<TOutput = symbol> = BaseSchemaAsync<
  symbol,
  TOutput
> & {
  schema: 'symbol';
};

/**
 * Creates an async symbol schema.
 *
 * @param error The error message.
 *
 * @returns An async symbol schema.
 */
export function symbolAsync(error?: FString): SymbolSchemaAsync {
  return {
    /**
     * The schema type.
     */
    schema: 'symbol',

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
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return getIssues(
          info,
          'type',
          'symbol',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return { output: input };
    },
  };
}
