import { describe, expect, test } from 'vitest';
import { isoTime } from './isoTime.ts';

describe('isoTime', () => {
  test('should pass only ISO times', () => {
    const validate = isoTime();
    const value1 = '19:34';
    expect(validate(value1).output).toBe(value1);
    const value2 = '00:00';
    expect(validate(value2).output).toBe(value2);
    const value3 = '23:59';
    expect(validate(value3).output).toBe(value3);

    expect(validate('').issue).toBeTruthy();
    expect(validate('1:34').issue).toBeTruthy();
    expect(validate('24:00').issue).toBeTruthy();
    expect(validate('01:60').issue).toBeTruthy();
    expect(validate('99:99').issue).toBeTruthy();
    expect(validate('0:00').issue).toBeTruthy();
    expect(validate('00:0').issue).toBeTruthy();
    expect(validate('000:00').issue).toBeTruthy();
    expect(validate('00:000').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO time!';
    const validate = isoTime(error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
