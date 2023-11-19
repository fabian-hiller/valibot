import { describe, expect, test } from 'vitest';
import { toMaxValue } from './toMaxValue.ts';

describe('toMaxValue', () => {
  test('should transform to a maximum value', () => {
    const transform = toMaxValue(10);
    expect(transform._parse(9).output).toBe(9);
    expect(transform._parse(10).output).toBe(10);
    expect(transform._parse(11).output).toBe(10);
  });
});
