import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue, stringify } from '../../utils/index.ts';
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
 * @param literal The literal value.
 * @param message The error message.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal: TLiteral,
  message?: ErrorMessage
): LiteralSchema<TLiteral> {
  return {
    type: 'literal',
    expects: stringify(literal),
    async: false,
    literal,
    message,
    _parse(input, config) {
      // Check type of input
      if (input !== this.literal) {
        return schemaIssue(this, input, config);
      }

      // Return parse result
      return parseResult(true, input as TLiteral);
    },
  };
}
