import type { BaseTransformation } from '../../types/index.ts';

/**
 * Trim end action type.
 */
export interface TrimEndAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'trim_end';
}

/**
 * Creates a trim end transformation action.
 *
 * @returns A trim end action.
 */
export function trimEnd(): TrimEndAction {
  return {
    kind: 'transformation',
    type: 'trim_end',
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.trimEnd();
      return dataset;
    },
  };
}
