import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult, stringify } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema type.
 */
export type LiteralSchema<
  TLiteral extends Literal,
  TOutput = TLiteral,
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
 * @param message The error message.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends Literal>(
  literal_: TLiteral,
  message?: ErrorMessage
): LiteralSchema<TLiteral> {
  return {
    type: 'literal',
    expects: stringify(literal_),
    async: false,
    literal: literal_,
    message,
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
