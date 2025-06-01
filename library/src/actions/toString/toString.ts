import type { BaseIssue, BaseTransformation, OutputDataset } from '../../types';
import { _addIssue } from '../../utils/index.ts';

/**
 * To string issue interface.
 */
export interface ToStringIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'to_string';
  /**
   * The expected property.
   */
  readonly expected: null;
}

/**
 * To string action interface.
 */
export interface ToStringAction<TInput>
  extends BaseTransformation<TInput, string, ToStringIssue<TInput>> {
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
    '~run'(dataset, config) {
      try {
        // @ts-expect-error
        dataset.value = String(dataset.value);
      } catch {
        _addIssue(this, 'string', dataset, config);
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset as OutputDataset<string, ToStringIssue<TInput>>;
    },
  };
}
