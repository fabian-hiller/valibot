import { describe, expect, test } from 'vitest';
import { toMinValue } from './toMinValue.ts';

describe('toMinValue', () => {
  test('should transform to a minimum value', () => {
    const transform = toMinValue(10);
    expect(transform(9)).toEqual({ output: 10 });
    expect(transform(10)).toEqual({ output: 10 });
    expect(transform(11)).toEqual({ output: 11 });
  });
});
