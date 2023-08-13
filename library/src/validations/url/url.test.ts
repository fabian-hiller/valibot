import { describe, expect, test } from 'vitest';
import { url } from './url.ts';

describe('url', () => {
  const info = { reason: 'any' as const };

  test('should pass only URLs', () => {
    const validate = url();
    const value1 = 'http://example.com';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 'http://www.example.com';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = 'https://example.com';
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = 'https://subdomain.example.com/path?param=value';
    expect(validate(value4, info)).toEqual({ output: value4 });
    const value5 = 'ftp://example.com';
    expect(validate(value5, info)).toEqual({ output: value5 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('example.com', info).issues?.length).toBe(1);
    expect(validate('//example.com', info).issues?.length).toBe(1);
    expect(validate('www.example.com', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an URL!';
    const validate = url(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
