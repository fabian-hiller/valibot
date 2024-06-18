import type { BaseTransformation, TypedDataset } from '../../types/index.ts';

/**
 * Array action type.
 */
type ArrayAction<TInput extends readonly unknown[], TOutput> = (
  output: TOutput,
  item: TInput[number],
  index: number,
  array: TInput
) => TOutput;

/**
 * Reduce items action type.
 */
export interface ReduceItemsAction<TInput extends readonly unknown[], TOutput>
  extends BaseTransformation<TInput, TOutput, never> {
  /**
   * The action type.
   */
  readonly type: 'reduce_items';
  /**
   * The action reference.
   */
  readonly reference: typeof reduceItems;
}

/**
 * Creates a reduce items transformation action.
 *
 * @param action The reduce items logic.
 * @param initial The initial value.
 *
 * @returns A reduce items action.
 */
export function reduceItems<TInput extends readonly unknown[], TOutput>(
  action: ArrayAction<TInput, TOutput>,
  initial: TOutput
): ReduceItemsAction<TInput, TOutput>;

export function reduceItems(
  action: ArrayAction<unknown[], unknown>,
  initial: unknown
): ReduceItemsAction<unknown[], unknown> {
  return {
    kind: 'transformation',
    type: 'reduce_items',
    reference: reduceItems,
    async: false,
    _run(dataset) {
      // @ts-expect-error
      dataset.value = dataset.value.reduce(action, initial);
      return dataset as TypedDataset<unknown, never>;
    },
  };
}
