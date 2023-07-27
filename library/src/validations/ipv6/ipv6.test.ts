import { describe, expect, test } from 'vitest';
import { ipv6 } from './ipv6.ts';

describe('ipv6', () => {
  const info = { reason: 'any' as const };

  test('should pass only IP v6', () => {
    const validate = ipv6();
    const value1 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    expect(validate(value1, info)).toBe(value1);
    const value2 = 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329';
    expect(validate(value2, info)).toBe(value2);
    const value3 = 'fe80::1ff:fe23:4567:890a';
    expect(validate(value3, info)).toBe(value3);
    const value4 = '2001:db8:85a3:8d3:1319:8a2e:370:7348';
    expect(validate(value4, info)).toBe(value4);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('1', info)).toThrowError();
    expect(() => validate('1.2.3', info)).toThrowError();
    expect(() => validate('192.168.1.1', info)).toThrowError();
    expect(() => validate('0.0.0.0', info)).toThrowError();
    expect(() =>
      validate('test:test:test:test:test:test:test:test', info)
    ).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an IP v6!';
    const validate = ipv6(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
