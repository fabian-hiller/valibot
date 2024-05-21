import type {
  BaseTransformationAsync,
  TypedDataset,
} from '../../types/index.ts';

/**
 * Transform action async type.
 */
export interface TransformActionAsync<TInput, TOutput>
  extends BaseTransformationAsync<TInput, TOutput, never> {
  /**
   * The action type.
   */
  readonly type: 'transform';
  /**
   * The action reference.
   */
  readonly reference: typeof transformAsync;
  /**
   * The transformation action.
   */
  readonly action: (input: TInput) => Promise<TOutput>;
}

/**
 * Creates a custom transformation action.
 *
 * @param action The transformation logic.
 *
 * @returns A transform action.
 */
export function transformAsync<TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>
): TransformActionAsync<TInput, TOutput> {
  return {
    kind: 'transformation',
    type: 'transform',
    reference: transformAsync,
    async: true,
    action,
    async _run(dataset) {
      // @ts-expect-error
      dataset.value = await action(dataset.value);
      // @ts-expect-error
      return dataset as TypedDataset<TOutput, never>;
    },
  };
}
