import { describe, expect, test } from 'vitest';
import { isoWeek } from './isoWeek';

describe('isoWeek', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO weeks', () => {
    const validate = isoWeek();
    const value1 = '2023-W24';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '0000-W01';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '9999-W53';
    expect(validate(value3, info)).toBe(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('123-W12', info)).toThrowError();
    expect(() => validate('0000-W00', info)).toThrowError();
    expect(() => validate('9999-W54', info)).toThrowError();
    // FIXME: expect(() => validate('2021W53', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an ISO week!';
    const validate = isoWeek(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
