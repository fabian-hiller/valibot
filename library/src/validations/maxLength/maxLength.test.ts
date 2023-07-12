import { describe, expect, test } from 'vitest';
import { maxLength } from './maxLength';

describe('maxLength', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid lengths', () => {
    const validate = maxLength(3);

    const value1 = '';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '12';
    expect(validate(value2, info)).toBe(value2);
    const value3 = [1, 2, 3];
    expect(validate(value3, info)).toEqual(value3);

    expect(() => validate('1234', info)).toThrowError();
    expect(() => validate('123456789', info)).toThrowError();
    expect(() => validate([1, 2, 3, 4], info)).toThrowError();
    expect(() => validate([1, 2, 3, 4, 5, 6, 7], info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value length is greater than "3"!';
    const validate = maxLength(3, error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
