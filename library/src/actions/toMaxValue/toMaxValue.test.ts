import { describe, expect, test } from 'vitest';
import { toMaxValue, type ToMaxValueAction } from './toMaxValue.ts';

describe('toMaxValue', () => {
  const action = toMaxValue<number, 10>(10);

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'to_max_value',
      reference: toMaxValue,
      requirement: 10,
      async: false,
      _run: expect.any(Function),
    } satisfies ToMaxValueAction<number, 10>);
  });

  test('should transform to max value', () => {
    const outputDataset = { typed: true, value: 10 };
    expect(action._run({ typed: true, value: 10 }, {})).toStrictEqual(
      outputDataset
    );
    expect(action._run({ typed: true, value: 11 }, {})).toStrictEqual(
      outputDataset
    );
    expect(
      action._run({ typed: true, value: Number.MAX_VALUE }, {})
    ).toStrictEqual(outputDataset);
  });

  test('should not transform value', () => {
    expect(
      action._run({ typed: true, value: Number.MIN_VALUE }, {})
    ).toStrictEqual({
      typed: true,
      value: Number.MIN_VALUE,
    });
    expect(action._run({ typed: true, value: 0 }, {})).toStrictEqual({
      typed: true,
      value: 0,
    });
    expect(action._run({ typed: true, value: 9 }, {})).toStrictEqual({
      typed: true,
      value: 9,
    });
  });
});
