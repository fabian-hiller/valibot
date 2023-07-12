import { describe, expect, test } from 'vitest';
import { maxRange } from './maxRange';

describe('maxRange', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid ranges', () => {
    const validate1 = maxRange('2023');
    expect(validate1('', info)).toBe('');
    expect(validate1('0', info)).toBe('0');
    expect(validate1('2023', info)).toBe('2023');
    expect(validate1('2022-01-01', info)).toBe('2022-01-01');
    expect(() => validate1('2024', info)).toThrowError();
    expect(() => validate1('2024-01-01', info)).toThrowError();

    const validate2 = maxRange(3);
    expect(validate2(-3, info)).toBe(-3);
    expect(validate2(0, info)).toBe(0);
    expect(validate2(3, info)).toBe(3);
    expect(() => validate2(4, info)).toThrowError();
    expect(() => validate2(456, info)).toThrowError();

    const validate3 = maxRange(3n);
    expect(validate3(-3n, info)).toBe(-3n);
    expect(validate3(0n, info)).toBe(0n);
    expect(validate3(3n, info)).toBe(3n);
    expect(() => validate3(4n, info)).toThrowError();
    expect(() => validate3(456n, info)).toThrowError();

    const validate4 = maxRange(new Date(Date.now() + 60000));
    const date1 = new Date();
    expect(validate4(date1, info)).toEqual(date1);
    const date2 = new Date(Date.now() + 10000);
    expect(validate4(date2, info)).toBe(date2);
    const date3 = new Date(Date.now() - 10000);
    expect(validate4(date3, info)).toBe(date3);
    expect(() => validate4(new Date(Date.now() + 120000), info)).toThrowError();
    expect(() =>
      validate4(new Date(Date.now() + 3600000), info)
    ).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value range is greater than "3"!';
    const validate = maxRange(3, error);
    expect(() => validate(4, info)).toThrowError(error);
  });
});
