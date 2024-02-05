import { describe, expect, test } from 'vitest';
import { isoDate } from './isoDate.ts';

describe('isoDate', () => {
  test('should pass only ISO dates', () => {
    const validate = isoDate();
    const value1 = '2023-07-11';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '0000-01-01';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '9999-12-31';
    expect(validate._parse(value3).output).toBe(value3);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('2023-7-11').issues).toBeTruthy();
    expect(validate._parse('23-07-11').issues).toBeTruthy();
    expect(validate._parse('0000-00-00').issues).toBeTruthy();
    expect(validate._parse('2023-13-32').issues).toBeTruthy();
    // FIXME: expect(validate._parse('2023-06-31').issues).toBeTruthy();
    expect(validate._parse('12345-01-01').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO date!';
    const validate = isoDate(error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
