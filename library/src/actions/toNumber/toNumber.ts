import type {
  BaseIssue,
  BaseTransformation,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * To number issue interface.
 */
export interface ToNumberIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'to_number';
  /**
   * The expected property.
   */
  readonly expected: null;
}

/**
 * To number action interface.
 */
export interface ToNumberAction<TInput>
  extends BaseTransformation<TInput, number, ToNumberIssue<TInput>> {
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
    '~run'(dataset, config) {
      try {
        // @ts-expect-error
        dataset.value = Number(dataset.value);
      } catch {
        _addIssue(this, 'number', dataset, config);
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset as OutputDataset<number, ToNumberIssue<TInput>>;
    },
  };
}
