import type { BaseTransformation } from '../../types/index.ts';

/**
 * Trim start action type.
 */
export interface TrimStartAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'trim_start';
}

/**
 * Creates a trim start transformation action.
 *
 * @returns A trim start action.
 */
export function trimStart(): TrimStartAction {
  return {
    kind: 'transformation',
    type: 'trim_start',
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.trimStart();
      return dataset;
    },
  };
}
