import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema async type.
 */
export type LiteralSchemaAsync<
  TLiteral extends Literal,
  TOutput = TLiteral
> = BaseSchemaAsync<TLiteral, TOutput> & {
  kind: 'literal';
  /**
   * The literal value.
   */
  literal: TLiteral;
};

/**
 * Creates an async literal schema.
 *
 * @param literal The literal value.
 * @param error The error message.
 *
 * @returns An async literal schema.
 */
export function literalAsync<TLiteral extends Literal>(
  literal: TLiteral,
  error?: ErrorMessage
): LiteralSchemaAsync<TLiteral> {
  return {
    kind: 'literal',
    async: true,
    literal,
    async _parse(input, info) {
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
