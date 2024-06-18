import type { BaseTransformation } from '../../types/index.ts';

/**
 * Array action type.
 */
type ArrayAction<TInput extends readonly unknown[], TOutput> = (
  item: TInput[number],
  index: number,
  array: TInput
) => TOutput;

/**
 * Map items action type.
 */
export interface MapItemsAction<
  TInput extends readonly unknown[],
  TOutput extends readonly unknown[],
> extends BaseTransformation<TInput, TOutput, never> {
  /**
   * The action type.
   */
  readonly type: 'map_items';
  /**
   * The action reference.
   */
  readonly reference: typeof mapItems;
}

/**
 * Creates a map items transformation action.
 *
 * @param action The map items logic.
 *
 * @returns A map items action.
 */
export function mapItems<TInput extends readonly unknown[], TOutput>(
  action: ArrayAction<TInput, TOutput>
): MapItemsAction<TInput, TOutput[]>;

export function mapItems(
  action: ArrayAction<unknown[], unknown>
): MapItemsAction<unknown[], unknown[]> {
  return {
    kind: 'transformation',
    type: 'map_items',
    reference: mapItems,
    async: false,
    _run(dataset) {
      dataset.value = dataset.value.map(action);
      return dataset;
    },
  };
}
