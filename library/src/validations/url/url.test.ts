import { describe, expect, test } from 'vitest';
import { url } from './url';

describe('url', () => {
  const info = { reason: 'any' as const };

  test('should pass only URLs', () => {
    const validate = url();
    const value1 = 'http://example.com';
    expect(validate(value1, info)).toBe(value1);
    const value2 = 'http://www.example.com';
    expect(validate(value2, info)).toBe(value2);
    const value3 = 'https://example.com';
    expect(validate(value3, info)).toBe(value3);
    const value4 = 'https://subdomain.example.com/path?param=value';
    expect(validate(value4, info)).toBe(value4);
    const value5 = 'ftp://example.com';
    expect(validate(value5, info)).toBe(value5);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('example.com', info)).toThrowError();
    expect(() => validate('//example.com', info)).toThrowError();
    expect(() => validate('www.example.com', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an URL!';
    const validate = url(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
