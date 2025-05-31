import type { BaseTransformation, SuccessDataset } from '../../types/index.ts';

/**
 * To date action interface.
 */
export interface ToDateAction<TInput extends string | number | Date>
  extends BaseTransformation<TInput, Date, never> {
  /**
   * The action type.
   */
  readonly type: 'to_date';
  /**
   * The action reference.
   */
  readonly reference: typeof toDate;
}

/**
 * Creates a to date transformation action.
 *
 * @returns A to date action.
 */
// @__NO_SIDE_EFFECTS__
export function toDate<
  TInput extends string | number | Date,
>(): ToDateAction<TInput> {
  return {
    kind: 'transformation',
    type: 'to_date',
    reference: toDate,
    async: false,
    '~run'(dataset) {
      // @ts-expect-error
      dataset.value = new Date(dataset.value);
      return dataset as SuccessDataset<Date>;
    },
  };
}
