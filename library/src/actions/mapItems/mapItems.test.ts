import { describe, expect, test } from 'vitest';
import { mapItems, type MapItemsAction } from './mapItems.ts';

describe('mapItems', () => {
  const operation = (item: number) => ({ item });
  const action = mapItems<number[], { item: number }>(operation);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'map_items',
      reference: mapItems,
      async: false,
      operation,
      '~validate': expect.any(Function),
    } satisfies MapItemsAction<number[], { item: number }>);
  });

  test('should transform input', () => {
    expect(
      action['~validate']({ typed: true, value: [-12, 345, 0] }, {})
    ).toStrictEqual({
      typed: true,
      value: [{ item: -12 }, { item: 345 }, { item: 0 }],
    });
  });
});
