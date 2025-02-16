import { describe, expect, test } from 'vitest';
import { reduceItems, type ReduceItemsAction } from './reduceItems.ts';

describe('reduceItems', () => {
  const operation = (output: number, item: number) => output + item;
  const initial = 0;
  const action = reduceItems<number[], number>(operation, initial);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'reduce_items',
      reference: reduceItems,
      async: false,
      operation,
      initial,
      '~run': expect.any(Function),
    } satisfies ReduceItemsAction<number[], number>);
  });

  test('should transform input', () => {
    expect(
      action['~run']({ typed: true, value: [9, -12, 345, 0, 999] }, {})
    ).toStrictEqual({
      typed: true,
      value: 1341,
    });
  });
});
