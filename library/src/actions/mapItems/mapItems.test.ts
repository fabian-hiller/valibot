import { describe, expect, test } from 'vitest';
import { mapItems, type MapItemsAction } from './mapItems.ts';

describe('mapItems', () => {
  const action = mapItems<number[], { item: number }>((item) => ({ item }));

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'map_items',
      reference: mapItems,
      async: false,
      _run: expect.any(Function),
    } satisfies MapItemsAction<number[], { item: number }[]>);
  });

  test('should transform input', () => {
    expect(
      action._run({ typed: true, value: [-12, 345, 0] }, {})
    ).toStrictEqual({
      typed: true,
      value: [{ item: -12 }, { item: 345 }, { item: 0 }],
    });
  });
});
