import { describe, expect, test } from 'vitest';
import { isin } from './isin.ts';

describe('isin', () => {
  test('should pass only ISIN', () => {
    const validate = isin();
    const value1 = 'US0378331005';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'GB0002634946';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 'CA0585861085';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 'DE0008430026';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = 'JP3910660004';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = 'AU0000XVGZA3';
    expect(validate._parse(value6).output).toBe(value6);
    const value7 = 'CH0044328745';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = 'SE0000108656';
    expect(validate._parse(value8).output).toBe(value8);
    const value9 = 'NL0000009165';
    expect(validate._parse(value9).output).toBe(value9);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('US1234567890').issues).toBeTruthy();
    expect(validate._parse('XX0002634946').issues).toBeTruthy();
    expect(validate._parse('CA058586108').issues).toBeTruthy();
    expect(validate._parse('DE00A8430026').issues).toBeTruthy();
    expect(validate._parse('FR00001202710').issues).toBeTruthy();
    expect(validate._parse('JP391066000Z').issues).toBeTruthy();
    expect(validate._parse('AU000XVGZA3A').issues).toBeTruthy();
    expect(validate._parse('CH00443287452').issues).toBeTruthy();
    expect(validate._parse('SE00001086566').issues).toBeTruthy();
    expect(validate._parse('NL0000009165A').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISIN!';
    const validate = isin(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
