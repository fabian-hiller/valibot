import { describe, expect, test } from 'vitest';
import { isoTimestamp } from './isoTimestamp.ts';

describe('isoTimestamp', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO timestamps', () => {
    const validate = isoTimestamp();
    const value1 = '2023-07-11T17:26:27.243Z';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '0000-01-01T00:00:00.000Z';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '9999-12-31T23:59:59.999Z';
    expect(validate(value3, info)).toBe(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('2023-07-11T17:26:27.243', info)).toThrowError();
    expect(() => validate('2023-07-1117:26:27.243Z', info)).toThrowError();
    expect(() => validate('0000-00-00T00:00:00.000Z', info)).toThrowError();
    expect(() => validate('9999-12-31T24:00:00.000', info)).toThrowError();
    expect(() => validate('10000-01-01T01:00:00.000Z', info)).toThrowError();
    expect(() => validate('0000-13-01T01:00:00.000Z', info)).toThrowError();
    expect(() => validate('0000-01-32T01:00:00.000Z', info)).toThrowError();
    expect(() => validate('0000-01-01T24:00:00.000Z', info)).toThrowError();
    expect(() => validate('0000-01-01T01:60:00.000Z', info)).toThrowError();
    expect(() => validate('0000-01-01T01:00:60.000Z', info)).toThrowError();
    // FIXME: expect(() => validate('2023-06-31T00:00:00.000Z', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an ISO timestamp!';
    const validate = isoTimestamp(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
