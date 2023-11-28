import type { BaseTransformation } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * To max value transformation type.
 */
export type ToMaxValueTransformation<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
> = BaseTransformation<TInput> & {
  /**
   * The transformation type.
   */
  type: 'to_max_value';
  /**
   * The maximum value.
   */
  requirement: TRequirement;
};

/**
 * Creates a transformation function that sets a string, number or date to a
 * maximum value.
 *
 * @param requirement The maximum value.
 *
 * @returns A transformation function.
 */
export function toMaxValue<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement): ToMaxValueTransformation<TInput, TRequirement> {
  return {
    type: 'to_max_value',
    async: false,
    requirement,
    _parse(input) {
      return getOutput(input > this.requirement ? this.requirement : input);
    },
  };
}
