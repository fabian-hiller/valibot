import { describe, expect, test } from 'vitest';
import { url } from './url.ts';

describe('url', () => {
  test('should pass only URLs', () => {
    const validate = url();
    const value1 = 'http://example.com';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'http://www.example.com';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 'https://example.com';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 'https://subdomain.example.com/path?param=value';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = 'ftp://example.com';
    expect(validate._parse(value5).output).toBe(value5);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('example.com').issues).toBeTruthy();
    expect(validate._parse('//example.com').issues).toBeTruthy();
    expect(validate._parse('www.example.com').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an URL!';
    const validate = url(error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
