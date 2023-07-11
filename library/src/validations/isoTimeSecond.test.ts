import { describe, expect, test } from 'vitest';
import { isoTimeSecond } from './isoTimeSecond';

describe('isoTimeSecond', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO time seconds', () => {
    const validate = isoTimeSecond();
    const value1 = '19:34:12';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '01:00:00';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '23:59:59';
    expect(validate(value3, info)).toBe(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('1:34:12', info)).toThrowError();
    expect(() => validate('00:00:00', info)).toThrowError();
    expect(() => validate('25:00:00', info)).toThrowError();
    expect(() => validate('01:60:00', info)).toThrowError();
    expect(() => validate('01:00:60', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an ISO time second!';
    const validate = isoTimeSecond(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
