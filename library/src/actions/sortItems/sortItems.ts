import type { BaseTransformation } from '../../types/index.ts';

/**
 * Array action type.
 */
type ArrayAction<TInput extends readonly unknown[]> = (
  itemA: TInput[number],
  itemB: TInput[number]
) => number;

/**
 * Sort items action type.
 */
export interface SortItemsAction<TInput extends readonly unknown[]>
  extends BaseTransformation<TInput, TInput, never> {
  /**
   * The action type.
   */
  readonly type: 'sort_items';
  /**
   * The action reference.
   */
  readonly reference: typeof sortItems;
  /**
   * The sort items operation.
   */
  readonly operation: ArrayAction<TInput> | undefined;
}

/**
 * Creates a sort items transformation action.
 *
 * @param operation The sort items operation.
 *
 * @returns A sort items action.
 */
export function sortItems<TInput extends readonly unknown[]>(
  operation?: ArrayAction<TInput>
): SortItemsAction<TInput>;

export function sortItems(
  operation?: ArrayAction<unknown[]>
): SortItemsAction<unknown[]> {
  return {
    kind: 'transformation',
    type: 'sort_items',
    reference: sortItems,
    async: false,
    operation,
    _run(dataset) {
      dataset.value = dataset.value.sort(this.operation);
      return dataset;
    },
  };
}
