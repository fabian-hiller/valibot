import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Symbol schema async type.
 */
export type SymbolSchemaAsync<TOutput = symbol> = BaseSchemaAsync<
  symbol,
  TOutput
> & {
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
      // Check type of input
      if (typeof input !== 'symbol') {
        return schemaIssue(this, symbolAsync, input, config);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}
