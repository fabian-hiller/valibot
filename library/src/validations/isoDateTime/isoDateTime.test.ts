import { describe, expect, test } from 'vitest';
import { isoDateTime } from './isoDateTime.ts';

describe('isoDateTime', () => {
  test('should pass only ISO date times', () => {
    const validate = isoDateTime();
    const value1 = '2023-07-11T19:34';
    expect(validate(value1).output).toBe(value1);
    const value2 = '0000-01-01T00:00';
    expect(validate(value2).output).toBe(value2);
    const value3 = '9999-12-31T23:59';
    expect(validate(value3).output).toBe(value3);

    expect(validate('').issue).toBeTruthy();
    expect(validate('2023-7-11T19:34').issue).toBeTruthy();
    expect(validate('23-07-11T19:34').issue).toBeTruthy();
    expect(validate('0000-00-00T00:00').issue).toBeTruthy();
    expect(validate('9999-13-32T25:60').issue).toBeTruthy();
    expect(validate('0000-01-01T24:00').issue).toBeTruthy();
    // FIXME: expect(validate('2023-06-31T00:00').issue).toBeTruthy();
    expect(validate('12345-01-01T01:00').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO date time!';
    const validate = isoDateTime(error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
