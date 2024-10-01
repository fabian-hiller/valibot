import type { BaseTransformation } from '../../types/index.ts';

/**
 * Trim action type.
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
export function trim(): TrimAction {
  return {
    kind: 'transformation',
    type: 'trim',
    reference: trim,
    async: false,
    '~validate'(dataset) {
      dataset.value = dataset.value.trim();
      return dataset;
    },
  };
}
