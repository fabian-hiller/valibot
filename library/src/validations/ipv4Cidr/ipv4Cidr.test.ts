import { describe, expect, test } from 'vitest';
import { ipv4Cidr } from './ipv4Cidr.ts';

describe('ipv4cidr', () => {
  test('should pass only IP v4 CIDR notation', () => {
    const validate = ipv4Cidr();
    const value1 = '192.168.1.1/24';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '127.0.0.1/16';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '0.0.0.0/0';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '255.255.255.255/32';
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('1').issues).toBeTruthy();
    expect(validate._parse('-1.0.0.0').issues).toBeTruthy();
    expect(validate._parse('0..0.0.0').issues).toBeTruthy();
    expect(validate._parse('1234.0.0.0').issues).toBeTruthy();
    expect(validate._parse('256.256.256.256').issues).toBeTruthy();
    expect(validate._parse('1.2.3').issues).toBeTruthy();
    expect(validate._parse('192.168.1.1/01').issues).toBeTruthy();
    expect(validate._parse('192.168.1.1/33').issues).toBeTruthy();
    expect(validate._parse('192.168.1.1/-1').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not in IP v4 CIDR notation!';
    const validate = ipv4Cidr(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
