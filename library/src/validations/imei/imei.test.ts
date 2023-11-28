import { describe, expect, test } from 'vitest';
import { imei } from './imei.ts';

describe('imei', () => {
  test('should pass only IMEIs', () => {
    const validate = imei();
    const value1 = '536498459191226';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '860548042618881';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '536889080592909';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '527769279848588';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = '454438576454550';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = '450066366634505';
    expect(validate._parse(value6).output).toBe(value6);

    const value7 = '45 006636 663450 5';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = '45/006636/663450/5';
    expect(validate._parse(value8).output).toBe(value8);
    const value9 = '45-006636-663450-5';
    expect(validate._parse(value9).output).toBe(value9);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('AA-BBBBBB-CCCCCC-D').issues).toBeTruthy();
    expect(validate._parse('53649845919125').issues).toBeTruthy();
    expect(validate._parse('536498459191225').issues).toBeTruthy();
    expect(validate._parse('5364984591912260').issues).toBeTruthy();
    expect(validate._parse('45_006636_663450_5').issues).toBeTruthy();
    expect(validate._parse('45  006636 663450 5').issues).toBeTruthy();
    expect(validate._parse('45- 006636-663450-5').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an IMEI!';
    const validate = imei(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
