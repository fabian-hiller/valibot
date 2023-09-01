import { getIssues } from '../../utils/index.ts';

import type { BaseSchemaAsync, FString } from '../../types.ts';
import type { Literal } from './types.ts';

/**
 * Literal schema async type.
 */
export type LiteralSchemaAsync<
  TLiteral extends Literal,
  TOutput = TLiteral
> = BaseSchemaAsync<TLiteral, TOutput> & {
  schema: 'literal';
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
  error?: FString
): LiteralSchemaAsync<TLiteral> {
  return {
    /**
     * The schema type.
     */
    schema: 'literal',

    /**
     * The literal value.
     */
    literal,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (input !== literal) {
        return getIssues(
          info,
          'type',
          'literal',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return { output: input as TLiteral };
    },
  };
}
