import { describe, expect, test } from 'vitest';
import { mac64 } from './mac64.ts';

describe('mac64', () => {
  test('should pass only MAC address', () => {
    const validate = mac64();

    const value1 = '00:25:96:FF:FE:12:34:56';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '00-1A-2B-3C-4D-5E-6F-70';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '0025.96FF.FE12.3456';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '0025:96FF:FE12:3456';
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('00:1G:2B:3C:4D:5E').issues).toBeTruthy();
    expect(validate._parse('00:1A:2B:3C:4D:5E:6F').issues).toBeTruthy();
    expect(validate._parse('0025.96FF.FE12').issues).toBeTruthy();
    expect(validate._parse('00:1A:2B:3C:4D:5E:6F:70:80').issues).toBeTruthy();
    expect(validate._parse('b605-2067-f958').issues).toBeTruthy();
    expect(validate._parse('00_1A_2B_3C_4D_5E').issues).toBeTruthy();
    expect(validate._parse('001A2B3C4D5E6F').issues).toBeTruthy();
    expect(validate._parse('ZZ:ZZ:ZZ:ZZ:ZZ:ZZ').issues).toBeTruthy();
    expect(
      validate._parse('00:1A:2B:3C:4D:5E:6F:70:80:90:AB').issues
    ).toBeTruthy();
    expect(validate._parse('001122334455').issues).toBeTruthy();
    expect(validate._parse('00:1A:2B:3C:4D:5E:6F:70:ZZ').issues).toBeTruthy();
    expect(validate._parse('GHIJ:KLNM:OPQR').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not MAC address!';
    const validate = mac64(error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
