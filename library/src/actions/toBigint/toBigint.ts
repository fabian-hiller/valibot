import type { BaseTransformation, SuccessDataset } from '../../types/index.ts';

/**
 * To bigint action interface.
 */
export interface ToBigintAction<
  TInput extends bigint | boolean | number | string,
> extends BaseTransformation<TInput, bigint, never> {
  /**
   * The action type.
   */
  readonly type: 'to_bigint';
  /**
   * The action reference.
   */
  readonly reference: typeof toBigint;
}

/**
 * Creates a to bigint transformation action.
 *
 * @returns A to bigint action.
 */
// @__NO_SIDE_EFFECTS__
export function toBigint<
  TInput extends bigint | boolean | number | string,
>(): ToBigintAction<TInput> {
  return {
    kind: 'transformation',
    type: 'to_bigint',
    reference: toBigint,
    async: false,
    '~run'(dataset) {
      // @ts-expect-error
      dataset.value = BigInt(dataset.value);
      return dataset as SuccessDataset<bigint>;
    },
  };
}
