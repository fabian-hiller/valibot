import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema type.
 */
export type LiteralSchema<
  TLiteral extends Literal,
  TOutput = TLiteral
> = BaseSchema<TLiteral, TOutput> & {
  kind: 'literal';
  /**
   * The literal value.
   */
  literal: TLiteral;
};

/**
 * Creates a literal schema.
 *
 * @param literal The literal value.
 * @param error The error message.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal: TLiteral,
  error?: ErrorMessage
): LiteralSchema<TLiteral> {
  return {
    kind: 'literal',
    async: false,
    literal,
    _parse(input, info) {
      // Check type of input
      if (input !== literal) {
        return getSchemaIssues(
          info,
          'type',
          'literal',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input as TLiteral);
    },
  };
}
