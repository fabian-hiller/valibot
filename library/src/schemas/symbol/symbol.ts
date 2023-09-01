import { getIssues } from '../../utils/index.ts';

import type { BaseSchema, FString } from '../../types.ts';
/**
 * Symbol schema type.
 */
export type SymbolSchema<TOutput = symbol> = BaseSchema<symbol, TOutput> & {
  schema: 'symbol';
};

/**
 * Creates a symbol schema.
 *
 * @param error The error message.
 *
 * @returns A symbol schema.
 */
export function symbol(error?: FString): SymbolSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'symbol',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
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
