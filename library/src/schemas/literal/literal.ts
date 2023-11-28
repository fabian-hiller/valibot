import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
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
 * @param message The error message.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal: TLiteral,
  message: ErrorMessage = 'Invalid type'
): LiteralSchema<TLiteral> {
  return {
    type: 'literal',
    async: false,
    literal,
    message,
    _parse(input, info) {
      // Check type of input
      if (input !== this.literal) {
        return getSchemaIssues(info, 'type', 'literal', this.message, input);
      }

      // Return input as output
      return getOutput(input as TLiteral);
    },
  };
}
