import type { BaseTransformation } from '../../types/index.ts';

/**
 * Upper case transformation action type.
 */
export interface UpperCaseAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'upper_case';
}

/**
 * Creates a upper case transformation action.
 *
 * @returns A upper case action.
 */
export function upperCase(): UpperCaseAction {
  return {
    kind: 'transformation',
    type: 'upper_case',
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.toUpperCase();
      return dataset;
    },
  };
}
