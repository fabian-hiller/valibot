import type { BaseTransformation, TypedDataset } from '../../types/index.ts';

/**
 * Transform action type.
 */
export interface TransformAction<TInput, TOutput>
  extends BaseTransformation<TInput, TOutput, never> {
  /**
   * The action type.
   */
  readonly type: 'transform';
  /**
   * The transformation action.
   */
  readonly action: (input: TInput) => TOutput;
}

/**
 * Creates a custom transformation action.
 *
 * @param action The transformation logic.
 *
 * @returns A transform action.
 */
export function transform<TInput, TOutput>(
  action: (input: TInput) => TOutput
): TransformAction<TInput, TOutput> {
  return {
    kind: 'transformation',
    type: 'transform',
    async: false,
    action,
    _run(dataset) {
      // @ts-expect-error
      dataset.value = action(dataset.value);
      // @ts-expect-error
      return dataset as TypedDataset<TOutput, never>;
    },
  };
}
