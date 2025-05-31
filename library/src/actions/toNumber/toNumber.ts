import type { BaseTransformation, SuccessDataset } from '../../types/index.ts';

/**
 * To number action interface.
 */
export interface ToNumberAction<TInput>
  extends BaseTransformation<TInput, number, never> {
  /**
   * The action type.
   */
  readonly type: 'to_number';
  /**
   * The action reference.
   */
  readonly reference: typeof toNumber;
}

/**
 * Creates a to number transformation action.
 *
 * @returns A to number action.
 */
// @__NO_SIDE_EFFECTS__
export function toNumber<TInput>(): ToNumberAction<TInput> {
  return {
    kind: 'transformation',
    type: 'to_number',
    reference: toNumber,
    async: false,
    '~run'(dataset) {
      // @ts-expect-error
      dataset.value = Number(dataset.value);
      return dataset as SuccessDataset<number>;
    },
  };
}
