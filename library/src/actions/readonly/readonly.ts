import type { BaseTransformation } from '../../types/index.ts';

/**
 * Readonly action type.
 */
export interface ReadonlyAction<TInput>
  extends BaseTransformation<TInput, Readonly<TInput>, never> {
  /**
   * The action type.
   */
  readonly type: 'readonly';
  /**
   * The action reference.
   */
  readonly reference: typeof readonly;
}

/**
 * Creates a readonly transformation action.
 *
 * @returns A readonly action.
 * 
 * @__NO_SIDE_EFFECTS__
 */
export function readonly<TInput>(): ReadonlyAction<TInput> {
  return {
    kind: 'transformation',
    type: 'readonly',
    reference: readonly,
    async: false,
    '~run'(dataset) {
      return dataset;
    },
  };
}
