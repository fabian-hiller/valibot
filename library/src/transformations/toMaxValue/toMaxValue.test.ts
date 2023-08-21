import { describe, expect, test } from 'vitest';
import { toMaxValue } from './toMaxValue.ts';

describe('toMaxValue', () => {
  test('should transform to a maximum value', () => {
    const transform = toMaxValue(10);
    expect(transform(9).output).toBe(9);
    expect(transform(10).output).toBe(10);
    expect(transform(11).output).toBe(10);
  });
});
