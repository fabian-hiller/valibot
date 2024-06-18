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
}

/**
 * Creates a filter items transformation action.
 *
 * @param action The filter items logic.
 *
 * @returns A filter items action.
 */
export function filterItems<TInput extends readonly unknown[]>(
  action: ArrayRequirement<TInput>
): FilterItemsAction<TInput>;

export function filterItems(
  action: ArrayRequirement<unknown[]>
): FilterItemsAction<unknown[]> {
  return {
    kind: 'transformation',
    type: 'filter_items',
    reference: filterItems,
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.filter(action);
      return dataset;
    },
  };
}
