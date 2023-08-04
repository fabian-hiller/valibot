import { describe, expect, test } from 'vitest';
import { imei } from './imei.ts';

describe('imei', () => {
  const info = { reason: 'any' as const };

  test('should pass only IMEIs', () => {
    const validate = imei();
    const value1 = '536498459191226';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '860548042618881';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '536889080592909';
    expect(validate(value3, info)).toBe(value3);
    const value4 = '527769279848588';
    expect(validate(value4, info)).toBe(value4);
    const value5 = '454438576454550';
    expect(validate(value5, info)).toBe(value5);
    const value6 = '450066366634505';
    expect(validate(value6, info)).toBe(value6);

    const value7 = '45 006636 663450 5';
    expect(validate(value7, info)).toBe(value7);
    const value8 = '45/006636/663450/5';
    expect(validate(value8, info)).toBe(value8);
    const value9 = '45-006636-663450-5';
    expect(validate(value9, info)).toBe(value9);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('AA-BBBBBB-CCCCCC-D', info)).toThrowError();
    expect(() => validate('53649845919125', info)).toThrowError();
    expect(() => validate('536498459191225', info)).toThrowError();
    expect(() => validate('5364984591912260', info)).toThrowError();
    expect(() => validate('45_006636_663450_5', info)).toThrowError();
    expect(() => validate('45  006636 663450 5', info)).toThrowError();
    expect(() => validate('45- 006636-663450-5', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an IMEI!';
    const validate = imei(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
