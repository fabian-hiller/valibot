import { describe, expect, test } from 'vitest';
import { ipv4 } from './ipv4.ts';

describe('ipv4', () => {
  test('should pass only IP v4', () => {
    const validate = ipv4();
    const value1 = '192.168.1.1';
    expect(validate(value1).output).toBe(value1);
    const value2 = '127.0.0.1';
    expect(validate(value2).output).toBe(value2);
    const value3 = '0.0.0.0';
    expect(validate(value3).output).toBe(value3);
    const value4 = '255.255.255.255';
    expect(validate(value4).output).toBe(value4);

    expect(validate('').issues).toBeTruthy();
    expect(validate('1').issues).toBeTruthy();
    expect(validate('-1.0.0.0').issues).toBeTruthy();
    expect(validate('0..0.0.0').issues).toBeTruthy();
    expect(validate('1234.0.0.0').issues).toBeTruthy();
    expect(validate('256.256.256.256').issues).toBeTruthy();
    expect(validate('1.2.3').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an IP v4!';
    const validate = ipv4(error);
    expect(validate('test').issues?.[0].message).toBe(error);
  });
});
