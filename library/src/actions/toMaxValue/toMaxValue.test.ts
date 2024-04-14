import { describe, expect, test } from 'vitest';
import { toMaxValue, type ToMaxValueAction } from './toMaxValue.ts';

describe('toMaxValue', () => {
  test('should return action object', () => {
    expect(toMaxValue(10)).toStrictEqual({
      kind: 'transformation',
      type: 'to_max_value',
      requirement: 10,
      async: false,
      _run: expect.any(Function),
    } satisfies ToMaxValueAction<number, 10>);
  });

  test('should transform to a maximum value', () => {
    const action = toMaxValue(10);
    expect(action._run({ typed: true, value: 9 }, {}).value).toBe(9);
    expect(action._run({ typed: true, value: 10 }, {}).value).toBe(10);
    expect(action._run({ typed: true, value: 11 }, {}).value).toBe(10);
  });
});
