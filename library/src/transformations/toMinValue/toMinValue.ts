import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

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
  return (input: TInput): PipeResult<TInput> =>
    getOutput(input < requirement ? requirement : input);
}
