import { describe, expect, test } from 'vitest';
import { minValue } from './minValue.ts';

describe('minValue', () => {
  test('should pass only valid values', () => {
    const validate1 = minValue('2023');
    expect(validate1('2023').output).toBe('2023');
    expect(validate1('2023-01-01').output).toBe('2023-01-01');
    expect(validate1('ABCD').output).toBe('ABCD');
    expect(validate1('').issue).toBeTruthy();
    expect(validate1('123').issue).toBeTruthy();
    expect(validate1('2022').issue).toBeTruthy();
    expect(validate1('2022-01-01').issue).toBeTruthy();

    const validate2 = minValue(3);
    expect(validate2(3).output).toBe(3);
    expect(validate2(12345).output).toBe(12345);
    expect(validate2(-123).issue).toBeTruthy();
    expect(validate2(0).issue).toBeTruthy();
    expect(validate2(2).issue).toBeTruthy();

    const validate3 = minValue(3n);
    expect(validate3(3n).output).toBe(3n);
    expect(validate3(12345n).output).toBe(12345n);
    expect(validate3(-123n).issue).toBeTruthy();
    expect(validate3(0n).issue).toBeTruthy();
    expect(validate3(2n).issue).toBeTruthy();

    const validate4 = minValue(new Date(Date.now() - 60000));
    const date1 = new Date();
    expect(validate4(date1).output).toBe(date1);
    const date2 = new Date(Date.now() + 10000);
    expect(validate4(date2).output).toBe(date2);
    const date3 = new Date(Date.now() - 10000);
    expect(validate4(date3).output).toBe(date3);
    expect(validate4(new Date(Date.now() - 120000)).issue).toBeTruthy();
    expect(validate4(new Date(Date.now() - 3600000)).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value value is less than "3"!';
    const validate = minValue(3, error);
    expect(validate(1).issue?.message).toBe(error);
  });
});
