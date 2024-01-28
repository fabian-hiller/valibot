import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue, stringify } from '../../utils/index.ts';
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
 * @param message The error message.
 *
 * @returns An async literal schema.
 */
export function literalAsync<TLiteral extends Literal>(
  literal: TLiteral,
  message?: ErrorMessage
): LiteralSchemaAsync<TLiteral> {
  return {
    type: 'literal',
    expects: stringify(literal),
    async: true,
    literal,
    message,
    async _parse(input, config) {
      // Check type of input
      if (input !== this.literal) {
        return schemaIssue(this, input, config);
      }

      // Return parse result
      return parseResult(true, input as TLiteral);
    },
  };
}
