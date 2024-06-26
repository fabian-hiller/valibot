import { describe, expect, test } from 'vitest';
import { sortItems, type SortItemsAction } from './sortItems.ts';

describe('sortItems', () => {
  const operation = (itemA: number, itemB: number) =>
    itemA > itemB ? 1 : itemA < itemB ? -1 : 0;
  const action = sortItems<number[]>(operation);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'sort_items',
      reference: sortItems,
      async: false,
      operation,
      _run: expect.any(Function),
    } satisfies SortItemsAction<number[]>);
  });

  test('should transform input', () => {
    expect(
      action._run({ typed: true, value: [9, -12, 345, 0, 999] }, {})
    ).toStrictEqual({
      typed: true,
      value: [-12, 0, 9, 345, 999],
    });
  });
});
