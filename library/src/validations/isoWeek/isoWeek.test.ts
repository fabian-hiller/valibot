import { describe, expect, test } from 'vitest';
import { isoWeek } from './isoWeek.ts';

describe('isoWeek', () => {
  test('should pass only ISO weeks', () => {
    const validate = isoWeek();
    const value1 = '2023-W24';
    expect(validate(value1).output).toBe(value1);
    const value2 = '0000-W01';
    expect(validate(value2).output).toBe(value2);
    const value3 = '9999-W53';
    expect(validate(value3).output).toBe(value3);

    expect(validate('').issues).toBeTruthy();
    expect(validate('123-W12').issues).toBeTruthy();
    expect(validate('0000-W00').issues).toBeTruthy();
    expect(validate('9999-W54').issues).toBeTruthy();
    // FIXME: expect(validate('2021W53').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO week!';
    const validate = isoWeek(error);
    expect(validate('test').issues?.[0].message).toBe(error);
  });
});
