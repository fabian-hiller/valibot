import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A symbol schema.
 */
export function symbol(
  messageOrMetadata?: ErrorMessageOrMetadata
): SymbolSchema {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'symbol',
    async: false,
    message,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return schemaIssue(info, 'type', 'symbol', this.message, input);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}
