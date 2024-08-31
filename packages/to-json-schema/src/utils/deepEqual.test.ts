import { expect, test } from 'vitest';
import { deepEqual } from './deepEqual.ts';

test(deepEqual, () => {
  expect(deepEqual('', '')).toBe(true);
  expect(deepEqual(0, 0)).toBe(true);
  expect(deepEqual(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(
    true
  );

  expect(deepEqual('', 0)).toBe(false);

  expect(deepEqual({}, {})).toBe(true);
  expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
  expect(deepEqual({ a: { a: 1 } }, { a: { a: 1 } })).toBe(true);

  expect(deepEqual([], [])).toBe(true);

  expect(deepEqual([1], [2])).toBe(false);
  expect(deepEqual([1], [1, 2])).toBe(false);
  expect(deepEqual([1, 2], [2, 1])).toBe(false);

  expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  expect(deepEqual({ a: 1 }, {})).toBe(false);
  expect(deepEqual({}, { a: 1 })).toBe(false);
  expect(deepEqual({ a: 1 }, { a: 1, [Symbol()]: 2 })).toBe(false);
  expect(deepEqual({ a: { a: 1 } }, { a: { a: 2 } })).toBe(false);
  expect(deepEqual({ a: 1 }, { a: 1, b: 1 })).toBe(false);
});
