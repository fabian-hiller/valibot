import type { BaseTransformation, SuccessDataset } from '../../types';

/**
 * To string action interface.
 */
export interface ToStringAction<TInput>
  extends BaseTransformation<TInput, string, never> {
  /**
   * The action type.
   */
  readonly type: 'to_string';
  /**
   * The action reference.
   */
  readonly reference: typeof toString;
}

/**
 * Creates a to string transformation action.
 *
 * @returns A to string action.
 */
// @__NO_SIDE_EFFECTS__
export function toString<TInput>(): ToStringAction<TInput> {
  return {
    kind: 'transformation',
    type: 'to_string',
    reference: toString,
    async: false,
    '~run'(dataset) {
      // @ts-expect-error
      dataset.value = String(dataset.value);
      return dataset as SuccessDataset<string>;
    },
  };
}
