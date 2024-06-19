import type { BaseTransformation, TypedDataset } from '../../types/index.ts';
import type { ArrayRequirement } from '../types.ts';

/**
 * Find item action type.
 */
export interface FindItemAction<TInput extends readonly unknown[]>
  extends BaseTransformation<TInput, TInput[number] | undefined, never> {
  /**
   * The action type.
   */
  readonly type: 'find_item';
  /**
   * The action reference.
   */
  readonly reference: typeof findItem;
}

/**
 * Creates a find item transformation action.
 *
 * @param action The find item logic.
 *
 * @returns A find item action.
 */
export function findItem<TInput extends readonly unknown[]>(
  action: ArrayRequirement<TInput>
): FindItemAction<TInput>;

export function findItem(
  action: ArrayRequirement<unknown[]>
): FindItemAction<unknown[]> {
  return {
    kind: 'transformation',
    type: 'find_item',
    reference: findItem,
    async: false,
    _run(dataset) {
      // @ts-expect-error
      dataset.value = dataset.value.find(action);
      return dataset as TypedDataset<unknown, never>;
    },
  };
}
