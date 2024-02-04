import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema type.
 */
export type LiteralSchema<
  TLiteral extends Literal,
  TOutput = TLiteral
> = BaseSchema<TLiteral, TOutput> & {
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
 * Creates a literal schema.
 *
 * @param literal The literal value.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal: TLiteral,
  messageOrMetadata?: ErrorMessageOrMetadata
): LiteralSchema<TLiteral> {
  // Extract message and metadata
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'literal',
    async: false,
    literal,
    message,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (input !== this.literal) {
        return schemaIssue(info, 'type', 'literal', this.message, input);
      }

      // Return parse result
      return parseResult(true, input as TLiteral);
    },
  };
}
