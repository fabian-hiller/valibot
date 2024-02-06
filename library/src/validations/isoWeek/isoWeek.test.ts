import { describe, expect, test } from 'vitest';
import { isoWeek } from './isoWeek.ts';

describe('isoWeek', () => {
  test('should pass only ISO weeks', () => {
    const validate = isoWeek();
    const value1 = '2023-W24';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '0000-W01';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '9999-W53';
    expect(validate._parse(value3).output).toBe(value3);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('123-W12').issues).toBeTruthy();
    expect(validate._parse('0000-W00').issues).toBeTruthy();
    expect(validate._parse('9999-W54').issues).toBeTruthy();
    // FIXME: expect(validate._parse('2021W53').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO week!';
    const validate = isoWeek(error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
