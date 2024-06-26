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
  /**
   * The reduce items operation.
   */
  readonly operation: ArrayAction<TInput, TOutput>;
  /**
   * The initial value.
   */
  readonly initial: TOutput;
}

/**
 * Creates a reduce items transformation action.
 *
 * @param operation The reduce items operation.
 * @param initial The initial value.
 *
 * @returns A reduce items action.
 */
export function reduceItems<TInput extends readonly unknown[], TOutput>(
  operation: ArrayAction<TInput, TOutput>,
  initial: TOutput
): ReduceItemsAction<TInput, TOutput>;

export function reduceItems(
  operation: ArrayAction<unknown[], unknown>,
  initial: unknown
): ReduceItemsAction<unknown[], unknown> {
  return {
    kind: 'transformation',
    type: 'reduce_items',
    reference: reduceItems,
    async: false,
    operation,
    initial,
    _run(dataset) {
      // @ts-expect-error
      dataset.value = dataset.value.reduce(this.operation, this.initial);
      return dataset as TypedDataset<unknown, never>;
    },
  };
}
