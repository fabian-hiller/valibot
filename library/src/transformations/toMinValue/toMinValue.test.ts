import { describe, expect, test } from 'vitest';
import { toMinValue } from './toMinValue.ts';

describe('toMinValue', () => {
  test('should transform to a minimum value', () => {
    const transform = toMinValue(10);
    expect(transform(9)).toBe(10);
    expect(transform(10)).toBe(10);
    expect(transform(11)).toBe(11);
  });
});
