import { describe, expect, test } from 'vitest';
import { maxBytes } from './maxBytes.ts';

describe('maxBytes', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid byte lengths', () => {
    const validate = maxBytes(3);

    const value1 = '';
    expect(validate(value1, info)).toBe(value1);
    const value2 = 'abc';
    expect(validate(value2, info)).toBe(value2);
    const value3 = 'あ'; // in UTF-8, 'あ' is 3 bytes
    expect(validate(value3, info)).toEqual(value3);

    expect(() => validate('1234', info)).toThrowError();
    expect(() => validate('あいう', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value byte length is greater than "3"!';
    const validate = maxBytes(3, error);
    expect(() => validate('あいう', info)).toThrowError(error);
  });
});
