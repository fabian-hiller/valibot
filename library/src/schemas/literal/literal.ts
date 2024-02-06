import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import {
  defaultArgs,
  schemaIssue,
  schemaResult,
  stringify,
} from '../../utils/index.ts';
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
  message: ErrorMessage | undefined;
};

/**
 * Creates a literal schema.
 *
 * @param literal_ The literal value.
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal_: TLiteral,
  messageOrMetadata?: ErrorMessageOrMetadata
): LiteralSchema<TLiteral> {
  // Extract message and metadata
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'literal',
    expects: stringify(literal_),
    async: false,
    literal: literal_,
    message,
    metadata,
    _parse(input, config) {
      // If type is valid, return schema result
      if (input === this.literal) {
        return schemaResult(true, input as TLiteral);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, literal, input, config);
    },
  };
}
