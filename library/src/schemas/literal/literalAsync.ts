import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema async type.
 */
export type LiteralSchemaAsync<
  TLiteral extends Literal,
  TOutput = TLiteral
> = BaseSchemaAsync<TLiteral, TOutput> & {
  /**
   * The schema type.
   */
  type: 'literal';
  /**
   * The literal value.
   */
  literal: TLiteral;
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates an async literal schema.
 *
 * @param literal The literal value.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async literal schema.
 */
export function literalAsync<TLiteral extends Literal>(
  literal: TLiteral,
  messageOrMetadata?: ErrorMessageOrMetadata
): LiteralSchemaAsync<TLiteral> {
  // Extract message and metadata
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'literal',
    async: true,
    literal,
    message,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (input !== this.literal) {
        return schemaIssue(info, 'type', 'literal', this.message, input);
      }

      // Return parse result
      return parseResult(true, input as TLiteral);
    },
  };
}
