import { describe, expect, test } from 'vitest';
import { isoDate } from './isoDate.ts';

describe('isoDate', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO dates', () => {
    const validate = isoDate();
    const value1 = '2023-07-11';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '0000-01-01';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = '9999-12-31';
    expect(validate(value3, info)).toEqual({ output: value3 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('2023-7-11', info).issues?.length).toBe(1);
    expect(validate('23-07-11', info).issues?.length).toBe(1);
    expect(validate('0000-00-00', info).issues?.length).toBe(1);
    expect(validate('2023-13-32', info).issues?.length).toBe(1);
    // FIXME: expect(validate('2023-06-31', info).issues?.length).toBe(1);
    expect(validate('12345-01-01', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO date!';
    const validate = isoDate(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
