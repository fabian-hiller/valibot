import { describe, expect, test } from 'vitest';
import { url } from './url.ts';

describe('url', () => {
  test('should pass only URLs', () => {
    const validate = url();
    const value1 = 'http://example.com';
    expect(validate(value1).output).toBe(value1);
    const value2 = 'http://www.example.com';
    expect(validate(value2).output).toBe(value2);
    const value3 = 'https://example.com';
    expect(validate(value3).output).toBe(value3);
    const value4 = 'https://subdomain.example.com/path?param=value';
    expect(validate(value4).output).toBe(value4);
    const value5 = 'ftp://example.com';
    expect(validate(value5).output).toBe(value5);

    expect(validate('').issues).toBeTruthy();
    expect(validate('example.com').issues).toBeTruthy();
    expect(validate('//example.com').issues).toBeTruthy();
    expect(validate('www.example.com').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an URL!';
    const validate = url(error);
    expect(validate('test').issues?.[0].message).toBe(error);
  });
});
