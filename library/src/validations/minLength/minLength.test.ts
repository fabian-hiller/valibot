import { describe, expect, test } from 'vitest';
import { minLength } from './minLength.ts';

describe('minLength', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid lengths', () => {
    const validate = minLength(3);

    const value1 = '123';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '123456789';
    expect(validate(value2, info)).toBe(value2);
    const value3 = [1, 2, 3];
    expect(validate(value3, info)).toEqual(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('12', info)).toThrowError();
    expect(() => validate([], info)).toThrowError();
    expect(() => validate([1, 2], info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value length is less than "3"!';
    const validate = minLength(3, error);
    expect(() => validate('1', info)).toThrowError(error);
  });
});
