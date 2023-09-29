import { describe, expect, test } from 'vitest';
import { mergeOutputs } from './mergeOutputs.ts';

describe('intersection', () => {
  test('should detect equal values', () => {
    const date = new Date();

    expect(mergeOutputs(1, 1)).toEqual({ output: 1 });
    expect(mergeOutputs('test', 'test')).toEqual({ output: 'test' });
    expect(mergeOutputs(date, date)).toEqual({ output: date });
    expect(mergeOutputs(new Date(+date), new Date(+date))).toEqual({
      output: date,
    });

    expect(mergeOutputs(1, 2)).toEqual({ invalid: true });
    expect(mergeOutputs('test', 'hello')).toEqual({ invalid: true });
    expect(mergeOutputs(1, 'test')).toEqual({ invalid: true });
    expect(mergeOutputs(new Date(+date), new Date(+date + 1234))).toEqual({
      invalid: true,
    });
  });

  test('should merge arrays', () => {
    expect(mergeOutputs([1, 2, 3], [1, 2, 3])).toEqual({ output: [1, 2, 3] });
    expect(mergeOutputs([{ a: 1 }], [{ b: 2 }])).toEqual({
      output: [{ a: 1, b: 2 }],
    });

    expect(mergeOutputs([1], [1, 2])).toEqual({ invalid: true });
    expect(mergeOutputs([1], ['1'])).toEqual({ invalid: true });
  });

  test('should merge objects', () => {
    expect(mergeOutputs({ key: 1 }, { key: 1 })).toEqual({
      output: { key: 1 },
    });
    expect(mergeOutputs({ a: 1 }, { b: 2 })).toEqual({
      output: { a: 1, b: 2 },
    });
    expect(mergeOutputs({ key: { a: 1 } }, { key: { b: 2 } })).toEqual({
      output: { key: { a: 1, b: 2 } },
    });

    expect(mergeOutputs({ key: 1 }, { key: '1' })).toEqual({ invalid: true });
  });
});
