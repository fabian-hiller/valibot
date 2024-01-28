import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
};

/**
 * Creates a symbol schema.
 *
 * @param message The error message.
 *
 * @returns A symbol schema.
 */
export function symbol(message?: ErrorMessage): SymbolSchema {
  return {
    type: 'symbol',
    expects: 'symbol',
    async: false,
    message,
    _parse(input, config) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return schemaIssue(this, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}
