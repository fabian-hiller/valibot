import { describe, expect, test } from 'vitest';
import { reduceItems, type ReduceItemsAction } from './reduceItems.ts';

describe('reduceItems', () => {
  const action = reduceItems<number[], number>(
    (output, item) => output + item,
    0
  );

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'reduce_items',
      reference: reduceItems,
      async: false,
      _run: expect.any(Function),
    } satisfies ReduceItemsAction<number[], number>);
  });

  test('should transform input', () => {
    expect(
      action._run({ typed: true, value: [9, -12, 345, 0, 999] }, {})
    ).toStrictEqual({
      typed: true,
      value: 1341,
    });
  });
});
