import { describe, expect, test } from 'vitest';
import { toMinValue } from './toMinValue.ts';

describe('toMinValue', () => {
  test('should transform to a minimum value', () => {
    const transform = toMinValue(10);
    expect(transform._parse(9).output).toBe(10);
    expect(transform._parse(10).output).toBe(10);
    expect(transform._parse(11).output).toBe(11);
  });
});
