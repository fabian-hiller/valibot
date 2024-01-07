import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema async type.
 */
export interface LiteralSchemaAsync<
  TLiteral extends Literal,
  TOutput = TLiteral
> extends BaseSchemaAsync<TLiteral, TOutput> {
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
}

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
  message: ErrorMessage = 'Invalid type'
): LiteralSchemaAsync<TLiteral> {
  return {
    type: 'literal',
    async: true,
    literal,
    message,
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
