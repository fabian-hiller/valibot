import { describe, expect, test } from 'vitest';
import { integer } from './integer.ts';

describe('integer', () => {
  const info = { reason: 'any' as const };

  test('should pass only integer', () => {
    const validate = integer();
    const value1 = 0;
    expect(validate(value1, info)).toBe(value1);
    const value2 = 1;
    expect(validate(value2, info)).toBe(value2);
    const value3 = 9007199254740992;
    expect(validate(value3, info)).toBe(value3);
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate(value4, info)).toBe(value4);
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate(value5, info)).toBe(value5);

    expect(() => validate(5.5, info)).toThrowError();
    expect(() => validate(0.000001, info)).toThrowError();
    expect(() => validate(-3.14, info)).toThrowError();
    expect(() => validate(NaN, info)).toThrowError();
    expect(() => validate(Infinity, info)).toThrowError();
    expect(() => validate(-Infinity, info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an integer!';
    const validate = integer(error);
    expect(() => validate(3.14, info)).toThrowError(error);
  });
});
