import { describe, expect, test } from 'vitest';
import { safeInteger } from './safeInteger.ts';

describe('safeInteger', () => {
  const info = { reason: 'any' as const };

  test('should pass only safe integer', () => {
    const validate = safeInteger();
    const value1 = 0;
    expect(validate(value1, info)).toBe(value1);
    const value2 = 1;
    expect(validate(value2, info)).toBe(value2);
    const value3 = -1;
    expect(validate(value3, info)).toBe(value3);
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate(value4, info)).toBe(value4);
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate(value5, info)).toBe(value5);

    expect(() => validate(Number.MAX_SAFE_INTEGER + 1, info)).toThrowError();
    expect(() => validate(Number.MIN_SAFE_INTEGER - 1, info)).toThrowError();
    expect(() => validate(3.14, info)).toThrowError();
    expect(() => validate(NaN, info)).toThrowError();
    expect(() => validate(Infinity, info)).toThrowError();
    expect(() => validate(-Infinity, info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a safe integer!';
    const validate = safeInteger(error);
    expect(() => validate(Infinity, info)).toThrowError(error);
  });
});
