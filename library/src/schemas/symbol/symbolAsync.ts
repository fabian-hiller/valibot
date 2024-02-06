import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

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
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async symbol schema.
 */
export function symbolAsync(
  messageOrMetadata?: ErrorMessageOrMetadata
): SymbolSchemaAsync {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'symbol',
    expects: 'symbol',
    async: true,
    message,
    metadata,
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
