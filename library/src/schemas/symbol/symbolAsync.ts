import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * Symbol schema async type.
 */
export interface SymbolSchemaAsync<TOutput = symbol>
  extends BaseSchemaAsync<symbol, TOutput> {
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
 * Creates an async symbol schema.
 *
 * @param message The error message.
 *
 * @returns An async symbol schema.
 */
export function symbolAsync(message?: ErrorMessage): SymbolSchemaAsync {
  return {
    type: 'symbol',
    expects: 'symbol',
    async: true,
    message,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (typeof input === 'symbol') {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, symbolAsync, input, config);
    },
  };
}
