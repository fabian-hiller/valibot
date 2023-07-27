import { describe, expect, test } from 'vitest';
import { ipv4 } from './ipv4.ts';

describe('ipv4', () => {
  const info = { reason: 'any' as const };

  test('should pass only IP v4', () => {
    const validate = ipv4();
    const value1 = '192.168.1.1';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '127.0.0.1';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '0.0.0.0';
    expect(validate(value3, info)).toBe(value3);
    const value4 = '255.255.255.255';
    expect(validate(value4, info)).toBe(value4);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('1', info)).toThrowError();
    expect(() => validate('-1.0.0.0', info)).toThrowError();
    expect(() => validate('0..0.0.0', info)).toThrowError();
    expect(() => validate('1234.0.0.0', info)).toThrowError();
    expect(() => validate('256.256.256.256', info)).toThrowError();
    expect(() => validate('1.2.3', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an IP v4!';
    const validate = ipv4(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
