import type {
  BaseIssue,
  BaseTransformation,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

export interface ToDateIssue<TInput extends string | number | Date>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'to_date';
  /**
   * The expected property.
   */
  readonly expected: null;
}

/**
 * To date action interface.
 */
export interface ToDateAction<TInput extends string | number | Date>
  extends BaseTransformation<TInput, Date, ToDateIssue<TInput>> {
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
    '~run'(dataset, config) {
      try {
        // @ts-expect-error
        dataset.value = new Date(dataset.value);
      } catch {
        _addIssue(this, 'date', dataset, config);
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset as OutputDataset<Date, ToDateIssue<TInput>>;
    },
  };
}
