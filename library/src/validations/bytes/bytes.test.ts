import { describe, expect, test } from 'vitest';
import { bytes } from './bytes.ts';

describe('bytes', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid byte lengths', () => {
    const validate = bytes(3);
    const value1 = '123';
    expect(validate(value1, info)).toBe(value1);
    const value2 = 'あ'; // in UTF-8, 'あ' is 3 bytes
    expect(validate(value2, info)).toEqual(value2);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('12', info)).toThrowError();
    expect(() => validate('1234', info)).toThrowError();
    expect(() => validate('あいう', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value byte length is not "10"!';
    const validate = bytes(10, error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
