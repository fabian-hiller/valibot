import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Symbol schema type.
 */
export type SymbolSchema<TOutput = symbol> = BaseSchema<symbol, TOutput> & {
  type: 'symbol';
};

/**
 * Creates a symbol schema.
 *
 * @param error The error message.
 *
 * @returns A symbol schema.
 */
export function symbol(error?: ErrorMessage): SymbolSchema {
  return {
    type: 'symbol',
    async: false,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return getSchemaIssues(
          info,
          'type',
          'symbol',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input);
    },
  };
}
