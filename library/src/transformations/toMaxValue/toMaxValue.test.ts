import { describe, expect, test } from 'vitest';
import { toMaxValue } from './toMaxValue.ts';

describe('toMaxValue', () => {
  test('should transform to a maximum value', () => {
    const transform = toMaxValue(10);
    expect(transform(9)).toEqual({ output: 9 });
    expect(transform(10)).toEqual({ output: 10 });
    expect(transform(11)).toEqual({ output: 10 });
  });
});
