import type { BaseTransformation } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * To min value transformation type.
 */
export type ToMinValueTransformation<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
> = BaseTransformation<TInput> & {
  /**
   * The transformation type.
   */
  type: 'to_min_value';
  /**
   * The minium value.
   */
  requirement: TRequirement;
};

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
>(requirement: TRequirement): ToMinValueTransformation<TInput, TRequirement> {
  return {
    type: 'to_min_value',
    async: false,
    requirement,
    _parse(input) {
      return getOutput(input < this.requirement ? this.requirement : input);
    },
  };
}
