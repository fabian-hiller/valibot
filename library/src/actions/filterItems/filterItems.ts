import type { BaseTransformation } from '../../types/index.ts';
import type { ArrayRequirement } from '../types.ts';

/**
 * Filter items action type.
 */
export interface FilterItemsAction<TInput extends readonly unknown[]>
  extends BaseTransformation<TInput, TInput, never> {
  /**
   * The action type.
   */
  readonly type: 'filter_items';
  /**
   * The action reference.
   */
  readonly reference: typeof filterItems;
  /**
   * The filter items operation.
   */
  readonly operation: ArrayRequirement<TInput>;
}

/**
 * Creates a filter items transformation action.
 *
 * @param operation The filter items operation.
 *
 * @returns A filter items action.
 */
export function filterItems<TInput extends readonly unknown[]>(
  operation: ArrayRequirement<TInput>
): FilterItemsAction<TInput>;

export function filterItems(
  operation: ArrayRequirement<unknown[]>
): FilterItemsAction<unknown[]> {
  return {
    kind: 'transformation',
    type: 'filter_items',
    reference: filterItems,
    async: false,
    operation,
    _run(dataset) {
      dataset.value = dataset.value.filter(this.operation);
      return dataset;
    },
  };
}
