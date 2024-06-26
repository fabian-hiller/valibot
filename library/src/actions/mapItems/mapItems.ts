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
export interface MapItemsAction<TInput extends readonly unknown[], TOutput>
  extends BaseTransformation<TInput, TOutput[], never> {
  /**
   * The action type.
   */
  readonly type: 'map_items';
  /**
   * The action reference.
   */
  readonly reference: typeof mapItems;
  /**
   * The map items operation.
   */
  readonly operation: ArrayAction<TInput, TOutput>;
}

/**
 * Creates a map items transformation action.
 *
 * @param operation The map items operation.
 *
 * @returns A map items action.
 */
export function mapItems<TInput extends readonly unknown[], TOutput>(
  operation: ArrayAction<TInput, TOutput>
): MapItemsAction<TInput, TOutput>;

export function mapItems(
  operation: ArrayAction<unknown[], unknown>
): MapItemsAction<unknown[], unknown> {
  return {
    kind: 'transformation',
    type: 'map_items',
    reference: mapItems,
    async: false,
    operation,
    _run(dataset) {
      dataset.value = dataset.value.map(this.operation);
      return dataset;
    },
  };
}
