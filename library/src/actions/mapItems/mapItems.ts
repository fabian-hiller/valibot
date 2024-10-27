import type { BaseTransformation } from '../../types/index.ts';
import type { ArrayInput } from '../types.ts';

/**
 * Array action type.
 */
type ArrayAction<TInput extends ArrayInput, TOutput> = (
  item: TInput[number],
  index: number,
  array: TInput
) => TOutput;

/**
 * Map items action type.
 */
export interface MapItemsAction<TInput extends ArrayInput, TOutput>
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
export function mapItems<TInput extends ArrayInput, TOutput>(
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
    '~validate'(dataset) {
      dataset.value = dataset.value.map(this.operation);
      return dataset;
    },
  };
}
