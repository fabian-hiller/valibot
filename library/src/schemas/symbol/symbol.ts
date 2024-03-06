import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * Symbol schema type.
 */
export interface SymbolSchema<TOutput = symbol>
  extends BaseSchema<symbol, TOutput> {
  /**
   * The schema type.
   */
  type: 'symbol';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
}

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
      // If type is valid, return schema result
      if (typeof input === 'symbol') {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, symbol, input, config);
    },
  };
}
