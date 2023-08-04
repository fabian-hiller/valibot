import { describe, expect, test } from 'vitest';
import { isoDateTime } from './isoDateTime.ts';

describe('isoDateTime', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO date times', () => {
    const validate = isoDateTime();
    const value1 = '2023-07-11T19:34';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '0000-01-01T00:00';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '9999-12-31T23:59';
    expect(validate(value3, info)).toBe(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('2023-7-11T19:34', info)).toThrowError();
    expect(() => validate('23-07-11T19:34', info)).toThrowError();
    expect(() => validate('0000-00-00T00:00', info)).toThrowError();
    expect(() => validate('9999-13-32T25:60', info)).toThrowError();
    expect(() => validate('0000-01-01T24:00', info)).toThrowError();
    // FIXME: expect(() => validate('2023-06-31T00:00', info)).toThrowError();
    expect(() => validate('12345-01-01T01:00', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an ISO date time!';
    const validate = isoDateTime(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
