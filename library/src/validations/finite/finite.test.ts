import { describe, expect, test } from 'vitest';
import { finite } from './finite.ts';

describe('finite', () => {
  const info = { reason: 'any' as const };

  test('should pass only a finite number', () => {
    const validate = finite();
    const value1 = 0;
    expect(validate(value1, info)).toBe(value1);
    const value2 = 1;
    expect(validate(value2, info)).toBe(value2);
    const value3 = -1;
    expect(validate(value3, info)).toBe(value3);
    const value4 = 3.14;
    expect(validate(value4, info)).toBe(value4);

    expect(() => validate(NaN, info)).toThrowError();
    expect(() => validate(Infinity, info)).toThrowError();
    expect(() => validate(-Infinity, info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a finite number';
    const validate = finite(error);
    expect(() => validate(Infinity, info)).toThrowError(error);
  });
});
