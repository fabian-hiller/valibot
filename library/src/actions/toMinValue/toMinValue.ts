import type { BaseTransformation } from '../../types/index.ts';
import type { ValueInput } from '../types.ts';

/**
 * To min value action interface.
 */
export interface ToMinValueAction<
  TInput extends ValueInput,
  TRequirement extends TInput,
> extends BaseTransformation<TInput, TInput, never> {
  /**
   * The action type.
   */
  readonly type: 'to_min_value';
  /**
   * The action reference.
   */
  readonly reference: typeof toMinValue;
  /**
   * The minimum value.
   */
  readonly requirement: TRequirement;
}

/**
 * Creates a to min value transformation action.
 *
 * @param requirement The minimum value.
 *
 * @returns A to min value action.
 */
// @__NO_SIDE_EFFECTS__
export function toMinValue<
  TInput extends ValueInput,
  const TRequirement extends TInput,
>(requirement: TRequirement): ToMinValueAction<TInput, TRequirement> {
  return {
    kind: 'transformation',
    type: 'to_min_value',
    reference: toMinValue,
    async: false,
    requirement,
    '~run'(dataset) {
      dataset.value =
        dataset.value < this.requirement ? this.requirement : dataset.value;
      return dataset;
    },
  };
}
