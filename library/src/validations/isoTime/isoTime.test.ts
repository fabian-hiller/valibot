import { describe, expect, test } from 'vitest';
import { isoTime } from './isoTime.ts';

describe('isoTime', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO times', () => {
    const validate = isoTime();
    const value1 = '19:34';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '00:00';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '23:59';
    expect(validate(value3, info)).toBe(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('1:34', info)).toThrowError();
    expect(() => validate('24:00', info)).toThrowError();
    expect(() => validate('01:60', info)).toThrowError();
    expect(() => validate('99:99', info)).toThrowError();
    expect(() => validate('0:00', info)).toThrowError();
    expect(() => validate('00:0', info)).toThrowError();
    expect(() => validate('000:00', info)).toThrowError();
    expect(() => validate('00:000', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an ISO time!';
    const validate = isoTime(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
