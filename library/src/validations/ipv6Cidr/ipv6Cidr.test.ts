import { describe, expect, test } from 'vitest';
import { ipv6Cidr } from './ipv6Cidr.ts';

describe('ipv6', () => {
  test('should pass only IP v6 CIDR notation', () => {
    const validate = ipv6Cidr();
    const value1 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334/0';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329/64';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 'fe80::1ff:fe23:4567:890a/128';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '2001:db8:85a3:8d3:1319:8a2e:370:7348/48';
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('1').issues).toBeTruthy();
    expect(validate._parse('1.2.3').issues).toBeTruthy();
    expect(validate._parse('192.168.1.1').issues).toBeTruthy();
    expect(validate._parse('0.0.0.0').issues).toBeTruthy();
    expect(
      validate._parse('test:test:test:test:test:test:test:test').issues
    ).toBeTruthy();
    expect(validate._parse('2001:db8:85a3:8d3:1319:8a2e:370:7348/129').issues).toBeTruthy()
    expect(validate._parse('2001:db8:85a3:8d3:1319:8a2e:370:7348/01').issues).toBeTruthy()
    expect(validate._parse('2001:db8:85a3:8d3:1319:8a2e:370:7348').issues).toBeTruthy()
    expect(validate._parse('2001:db8:85a3:8d3:1319:8a2e:370:7348/-1').issues).toBeTruthy()
    expect(validate._parse('2001:db8:85a3:8d3:1319:8a2e:370:7348/test').issues).toBeTruthy()
  });

  test('should return custom error message', () => {
    const error = 'Value is not in IP v6 CIDR notation!';
    const validate = ipv6Cidr(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
