import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Symbol schema type.
 */
export type SymbolSchema<TOutput = symbol> = BaseSchema<symbol, TOutput> & {
  /**
   * The schema type.
   */
  type: 'symbol';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates a symbol schema.
 *
 * @param message The error message.
 *
 * @returns A symbol schema.
 */
export function symbol(message: ErrorMessage = 'Invalid type'): SymbolSchema {
  return {
    type: 'symbol',
    async: false,
    message,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return getSchemaIssues(info, 'type', 'symbol', this.message, input);
      }

      // Return input as output
      return getOutput(input);
    },
  };
}
