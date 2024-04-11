import type { BaseTransformation } from '../../types/index.ts';

/**
 * To upper case transformation action type.
 */
export interface ToUpperCaseAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'to_upper_case';
}

/**
 * Creates a to upper case transformation action.
 *
 * @returns A to upper case action.
 */
export function toUpperCase(): ToUpperCaseAction {
  return {
    kind: 'transformation',
    type: 'to_upper_case',
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.toUpperCase();
      return dataset;
    },
  };
}
