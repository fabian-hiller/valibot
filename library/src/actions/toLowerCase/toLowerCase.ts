import type { BaseTransformation } from '../../types/index.ts';

/**
 * Lower case transformation action type.
 */
export interface LowerCaseAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'lower_case';
}

/**
 * Creates a lower case transformation action.
 *
 * @returns A lower case action.
 */
export function lowerCase(): LowerCaseAction {
  return {
    kind: 'transformation',
    type: 'lower_case',
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.toLowerCase();
      return dataset;
    },
  };
}
