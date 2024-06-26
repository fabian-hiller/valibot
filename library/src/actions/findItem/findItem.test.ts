import { describe, expect, test } from 'vitest';
import { findItem, type FindItemAction } from './findItem.ts';

describe('findItem', () => {
  const operation = (item: number) => item > 9;
  const action = findItem<number[]>(operation);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'find_item',
      reference: findItem,
      async: false,
      operation,
      _run: expect.any(Function),
    } satisfies FindItemAction<number[]>);
  });

  describe('should transform input', () => {
    test('to searched item', () => {
      expect(
        action._run({ typed: true, value: [-12, 9, 345, 10, 0, 999] }, {})
      ).toStrictEqual({
        typed: true,
        value: 345,
      });
    });

    test('to undefined', () => {
      expect(
        action._run({ typed: true, value: [-12, 9, 0] }, {})
      ).toStrictEqual({
        typed: true,
        value: undefined,
      });
    });
  });
});
