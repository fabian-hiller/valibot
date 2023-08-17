import type { BaseSchema } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Literal schema type.
 */
export type LiteralSchema<
  TLiteralValue extends string | number,
  TOutput = TLiteralValue
> = BaseSchema<TLiteralValue, TOutput> & {
  schema: 'literal';
  literal: TLiteralValue;
};

/**
 * Creates a literal schema.
 *
 * @param literal The literal value.
 * @param error The error message.
 *
 * @returns A literal schema.
 */
export function literal<TLiteral extends string | number>(
  literal: TLiteral,
  error?: string
): LiteralSchema<TLiteral> {
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (input !== literal) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'literal',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Return input as output
      return { output: input as TLiteral };
    },
  };
}
