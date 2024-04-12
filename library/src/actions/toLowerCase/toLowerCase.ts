import type { BaseTransformation } from '../../types/index.ts';

/**
 * To lower case transformation action type.
 */
export interface ToLowerCaseAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'to_lower_case';
}

/**
 * Creates a to lower case transformation action.
 *
 * @returns A to lower case action.
 */
export function toLowerCase(): ToLowerCaseAction {
  return {
    kind: 'transformation',
    type: 'to_lower_case',
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.toLowerCase();
      return dataset;
    },
  };
}
