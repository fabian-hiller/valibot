import type {
  BaseSchemaAsync,
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
  message: ErrorMessage | undefined;
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
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'literal',
    expects: stringify(literal),
    async: true,
    literal,
    message,
    metadata,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (input === this.literal) {
        return schemaResult(true, input as TLiteral);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, literalAsync, input, config);
    },
  };
}
