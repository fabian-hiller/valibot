import { describe, expect, test } from 'vitest';
import { toMinValue, type ToMinValueAction } from './toMinValue.ts';

describe('toMinValue', () => {
  const action = toMinValue<number, 10>(10);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'to_min_value',
      requirement: 10,
      async: false,
      _run: expect.any(Function),
    } satisfies ToMinValueAction<number, 10>);
  });

  test('should transform to min value', () => {
    const outputDataset = { typed: true, value: 10 };
    expect(action._run({ typed: true, value: 9 }, {})).toStrictEqual(
      outputDataset
    );
    expect(action._run({ typed: true, value: 0 }, {})).toStrictEqual(
      outputDataset
    );
    expect(
      action._run({ typed: true, value: Number.MIN_VALUE }, {})
    ).toStrictEqual(outputDataset);
  });

  test('should not transform value', () => {
    expect(action._run({ typed: true, value: 10 }, {})).toStrictEqual({
      typed: true,
      value: 10,
    });
    expect(action._run({ typed: true, value: 11 }, {})).toStrictEqual({
      typed: true,
      value: 11,
    });
    expect(
      action._run({ typed: true, value: Number.MAX_VALUE }, {})
    ).toStrictEqual({
      typed: true,
      value: Number.MAX_VALUE,
    });
  });
});
