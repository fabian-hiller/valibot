import { describe, expect, test } from 'vitest';
import { maxValue } from './maxValue.ts';

describe('maxValue', () => {
  test('should pass only valid values', () => {
    const validate1 = maxValue('2023');
    expect(validate1._parse('').output).toBe('');
    expect(validate1._parse('0').output).toBe('0');
    expect(validate1._parse('2023').output).toBe('2023');
    expect(validate1._parse('2022-01-01').output).toBe('2022-01-01');
    expect(validate1._parse('2024').issues).toBeTruthy();
    expect(validate1._parse('2024-01-01').issues).toBeTruthy();

    const validate2 = maxValue(3);
    expect(validate2._parse(-3).output).toBe(-3);
    expect(validate2._parse(0).output).toBe(0);
    expect(validate2._parse(3).output).toBe(3);
    expect(validate2._parse(4).issues).toBeTruthy();
    expect(validate2._parse(456).issues).toBeTruthy();

    const validate3 = maxValue(3n);
    expect(validate3._parse(-3n).output).toBe(-3n);
    expect(validate3._parse(0n).output).toBe(0n);
    expect(validate3._parse(3n).output).toBe(3n);
    expect(validate3._parse(4n).issues).toBeTruthy();
    expect(validate3._parse(456n).issues).toBeTruthy();

    const validate4 = maxValue(new Date(Date.now() + 60000));
    const date1 = new Date();
    expect(validate4._parse(date1).output).toBe(date1);
    const date2 = new Date(Date.now() + 10000);
    expect(validate4._parse(date2).output).toBe(date2);
    const date3 = new Date(Date.now() - 10000);
    expect(validate4._parse(date3).output).toBe(date3);
    expect(validate4._parse(new Date(Date.now() + 120000)).issues).toBeTruthy();
    expect(
      validate4._parse(new Date(Date.now() + 3600000)).issues
    ).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value value is greater than "3"!';
    const validate = maxValue(3, error);
    expect(validate._parse(4).issues?.[0].message).toBe(error);
  });
});
