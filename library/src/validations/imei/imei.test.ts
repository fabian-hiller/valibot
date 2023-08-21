import { describe, expect, test } from 'vitest';
import { imei } from './imei.ts';

describe('imei', () => {
  test('should pass only IMEIs', () => {
    const validate = imei();
    const value1 = '536498459191226';
    expect(validate(value1).output).toBe(value1);
    const value2 = '860548042618881';
    expect(validate(value2).output).toBe(value2);
    const value3 = '536889080592909';
    expect(validate(value3).output).toBe(value3);
    const value4 = '527769279848588';
    expect(validate(value4).output).toBe(value4);
    const value5 = '454438576454550';
    expect(validate(value5).output).toBe(value5);
    const value6 = '450066366634505';
    expect(validate(value6).output).toBe(value6);

    const value7 = '45 006636 663450 5';
    expect(validate(value7).output).toBe(value7);
    const value8 = '45/006636/663450/5';
    expect(validate(value8).output).toBe(value8);
    const value9 = '45-006636-663450-5';
    expect(validate(value9).output).toBe(value9);

    expect(validate('').issue).toBeTruthy();
    expect(validate('AA-BBBBBB-CCCCCC-D').issue).toBeTruthy();
    expect(validate('53649845919125').issue).toBeTruthy();
    expect(validate('536498459191225').issue).toBeTruthy();
    expect(validate('5364984591912260').issue).toBeTruthy();
    expect(validate('45_006636_663450_5').issue).toBeTruthy();
    expect(validate('45  006636 663450 5').issue).toBeTruthy();
    expect(validate('45- 006636-663450-5').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an IMEI!';
    const validate = imei(error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
