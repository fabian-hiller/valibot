import { describe, expect, test } from 'vitest';
import { ipv4 } from './ipv4.ts';

describe('ipv4', () => {
  const info = { reason: 'any' as const };

  test('should pass only IP v4', () => {
    const validate = ipv4();
    const value1 = '192.168.1.1';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '127.0.0.1';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = '0.0.0.0';
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = '255.255.255.255';
    expect(validate(value4, info)).toEqual({ output: value4 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('1', info).issues?.length).toBe(1);
    expect(validate('-1.0.0.0', info).issues?.length).toBe(1);
    expect(validate('0..0.0.0', info).issues?.length).toBe(1);
    expect(validate('1234.0.0.0', info).issues?.length).toBe(1);
    expect(validate('256.256.256.256', info).issues?.length).toBe(1);
    expect(validate('1.2.3', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an IP v4!';
    const validate = ipv4(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
