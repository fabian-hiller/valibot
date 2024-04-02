import type { BaseTransformation } from '../../types/index.ts';

/**
 * Trim action type.
 */
export interface TrimAction extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'trim';
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
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.trim();
      return dataset;
    },
  };
}
