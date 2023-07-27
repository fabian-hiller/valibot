import { describe, expect, test } from 'vitest';
import { value } from './value.ts';

describe('value', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid values', () => {
    const validate1 = value(3);
    const value1 = 3;
    expect(validate1(value1, info)).toBe(value1);

    const validate2 = value('test');
    const value2 = 'test';
    expect(validate2(value2, info)).toEqual(value2);

    expect(() => validate1(2, info)).toThrowError();
    expect(() => validate1(4, info)).toThrowError();
    expect(() => validate2('tes', info)).toThrowError();
    expect(() => validate2('testx', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not "10"!';
    const validate = value(10, error);
    expect(() => validate(123, info)).toThrowError(error);
  });
});
