import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage;
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
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'symbol',
    async: true,
    message,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return schemaIssue(info, 'type', 'symbol', this.message, input);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}
