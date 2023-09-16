import { describe, expect, test } from 'vitest';
import { isoDate } from './isoDate.ts';

describe('isoDate', () => {
  test('should pass only ISO dates', () => {
    const validate = isoDate();
    const value1 = '2023-07-11';
    expect(validate(value1).output).toBe(value1);
    const value2 = '0000-01-01';
    expect(validate(value2).output).toBe(value2);
    const value3 = '9999-12-31';
    expect(validate(value3).output).toBe(value3);

    expect(validate('').issues).toBeTruthy();
    expect(validate('2023-7-11').issues).toBeTruthy();
    expect(validate('23-07-11').issues).toBeTruthy();
    expect(validate('0000-00-00').issues).toBeTruthy();
    expect(validate('2023-13-32').issues).toBeTruthy();
    // FIXME: expect(validate('2023-06-31').issues).toBeTruthy();
    expect(validate('12345-01-01').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO date!';
    const validate = isoDate(error);
    expect(validate('test').issues?.[0].message).toBe(error);
  });
});
