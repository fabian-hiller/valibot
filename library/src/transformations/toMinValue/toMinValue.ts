import type { ParseResult } from '../../types.ts';

/**
 * Creates a transformation function that sets a string, number or date to a
 * minimum value.
 *
 * @param requirement The minimum value.
 *
 * @returns A transformation function.
 */
export function toMinValue<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement) {
  return (input: TInput): ParseResult<TInput> => ({
    output: input < requirement ? requirement : input,
  });
}
