import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

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
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A symbol schema.
 */
export function symbol(
  messageOrMetadata?: ErrorMessageOrMetadata
): SymbolSchema {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'symbol',
    expects: 'symbol',
    async: false,
    message,
    metadata,
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
