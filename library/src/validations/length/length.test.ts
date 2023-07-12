import { describe, expect, test } from 'vitest';
import { length } from './length';

describe('length', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid lengths', () => {
    const validate = length(3);
    const value1 = '123';
    expect(validate(value1, info)).toBe(value1);
    const value2 = [1, 2, 3];
    expect(validate(value2, info)).toEqual(value2);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('12', info)).toThrowError();
    expect(() => validate('1234', info)).toThrowError();
    expect(() => validate([1, 2], info)).toThrowError();
    expect(() => validate([1, 2, 3, 4], info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value length is not "10"!';
    const validate = length(10, error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
