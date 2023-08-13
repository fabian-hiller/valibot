import { describe, expect, test } from 'vitest';
import { isoWeek } from './isoWeek.ts';

describe('isoWeek', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO weeks', () => {
    const validate = isoWeek();
    const value1 = '2023-W24';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '0000-W01';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = '9999-W53';
    expect(validate(value3, info)).toEqual({ output: value3 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('123-W12', info).issues?.length).toBe(1);
    expect(validate('0000-W00', info).issues?.length).toBe(1);
    expect(validate('9999-W54', info).issues?.length).toBe(1);
    // FIXME: expect(validate('2021W53', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO week!';
    const validate = isoWeek(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
