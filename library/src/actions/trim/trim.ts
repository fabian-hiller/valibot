import type { BaseTransformation } from '../../types/index.ts';

/**
 * Trim action interface.
 */
export interface TrimAction extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'trim';
  /**
   * The action reference.
   */
  readonly reference: typeof trim;
}

/**
 * Creates a trim transformation action.
 *
 * @returns A trim action.
 */
// @__NO_SIDE_EFFECTS__
export function trim(): TrimAction {
  return {
    kind: 'transformation',
    type: 'trim',
    reference: trim,
    async: false,
    '~run'(dataset) {
      dataset.value = dataset.value.trim();
      return dataset;
    },
  };
}
