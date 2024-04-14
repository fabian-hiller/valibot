import { describe, expect, test } from 'vitest';
import { toMinValue, type ToMinValueAction } from './toMinValue.ts';

describe('toMinValue', () => {
  test('should return action object', () => {
    expect(toMinValue(10)).toStrictEqual({
      kind: 'transformation',
      type: 'to_min_value',
      requirement: 10,
      async: false,
      _run: expect.any(Function),
    } satisfies ToMinValueAction<number, 10>);
  });

  test('should transform to a minimum value', () => {
    const action = toMinValue(10);
    expect(action._run({ typed: true, value: 9 }, {}).value).toBe(10);
    expect(action._run({ typed: true, value: 10 }, {}).value).toBe(10);
    expect(action._run({ typed: true, value: 11 }, {}).value).toBe(11);
  });
});
