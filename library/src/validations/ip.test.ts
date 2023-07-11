import { describe, expect, test } from 'vitest';
import { ip } from './ip';

describe('ip', () => {
  const info = { reason: 'any' as const };

  test('should pass only IP v4 or v6', () => {
    const validate = ip();
    const value1 = '192.168.1.1';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '127.0.0.1';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '0.0.0.0';
    expect(validate(value3, info)).toBe(value3);
    const value4 = '255.255.255.255';
    expect(validate(value4, info)).toBe(value4);
    const value5 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    expect(validate(value5, info)).toBe(value5);
    const value6 = 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329';
    expect(validate(value6, info)).toBe(value6);
    const value7 = 'fe80::1ff:fe23:4567:890a';
    expect(validate(value7, info)).toBe(value7);
    const value8 = '2001:db8:85a3:8d3:1319:8a2e:370:7348';
    expect(validate(value8, info)).toBe(value8);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('1', info)).toThrowError();
    expect(() => validate('-1.0.0.0', info)).toThrowError();
    expect(() => validate('0..0.0.0', info)).toThrowError();
    expect(() => validate('1234.0.0.0', info)).toThrowError();
    expect(() => validate('256.256.256.256', info)).toThrowError();
    expect(() => validate('1.2.3', info)).toThrowError();
    expect(() => validate('0.0.0.0.0', info)).toThrowError();
    expect(() =>
      validate('test:test:test:test:test:test:test:test', info)
    ).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an IP v4 or v6!';
    const validate = ip(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
