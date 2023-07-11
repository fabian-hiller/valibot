import { describe, expect, test } from 'vitest';
import { minRange } from './minRange';

describe('minRange', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid ranges', () => {
    const validate1 = minRange('2023');
    expect(validate1('2023', info)).toBe('2023');
    expect(validate1('2023-01-01', info)).toBe('2023-01-01');
    expect(validate1('ABCD', info)).toBe('ABCD');
    expect(() => validate1('', info)).toThrowError();
    expect(() => validate1('123', info)).toThrowError();
    expect(() => validate1('2022', info)).toThrowError();
    expect(() => validate1('2022-01-01', info)).toThrowError();

    const validate2 = minRange(3);
    expect(validate2(3, info)).toBe(3);
    expect(validate2(12345, info)).toBe(12345);
    expect(() => validate2(-123, info)).toThrowError();
    expect(() => validate2(0, info)).toThrowError();
    expect(() => validate2(2, info)).toThrowError();

    const validate3 = minRange(3n);
    expect(validate3(3n, info)).toBe(3n);
    expect(validate3(12345n, info)).toBe(12345n);
    expect(() => validate3(-123n, info)).toThrowError();
    expect(() => validate3(0n, info)).toThrowError();
    expect(() => validate3(2n, info)).toThrowError();

    const validate4 = minRange(new Date(Date.now() - 60000));
    const date1 = new Date();
    expect(validate4(date1, info)).toEqual(date1);
    const date2 = new Date(Date.now() + 10000);
    expect(validate4(date2, info)).toBe(date2);
    const date3 = new Date(Date.now() - 10000);
    expect(validate4(date3, info)).toBe(date3);
    expect(() => validate4(new Date(Date.now() - 120000), info)).toThrowError();
    expect(() =>
      validate4(new Date(Date.now() - 3600000), info)
    ).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value range is less than "3"!';
    const validate = minRange(3, error);
    expect(() => validate(1, info)).toThrowError(error);
  });
});
