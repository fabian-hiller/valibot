import { describe, expect, test } from 'vitest';
import { filterItems, type FilterItemsAction } from './filterItems.ts';

describe('filterItems', () => {
  const operation = (item: number) => item > 9;
  const action = filterItems<number[]>(operation);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'filter_items',
      reference: filterItems,
      async: false,
      operation,
      '~validate': expect.any(Function),
    } satisfies FilterItemsAction<number[]>);
  });

  test('should transform input', () => {
    expect(
      action['~validate']({ typed: true, value: [-12, 345, 0, 9, 10, 999] }, {})
    ).toStrictEqual({
      typed: true,
      value: [345, 10, 999],
    });
  });
});
