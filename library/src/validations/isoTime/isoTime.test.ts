import { describe, expect, test } from 'vitest';
import { isoTime } from './isoTime.ts';

describe('isoTime', () => {
  const info = { reason: 'any' as const };

  test('should pass only ISO times', () => {
    const validate = isoTime();
    const value1 = '19:34';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '00:00';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = '23:59';
    expect(validate(value3, info)).toEqual({ output: value3 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('1:34', info).issues?.length).toBe(1);
    expect(validate('24:00', info).issues?.length).toBe(1);
    expect(validate('01:60', info).issues?.length).toBe(1);
    expect(validate('99:99', info).issues?.length).toBe(1);
    expect(validate('0:00', info).issues?.length).toBe(1);
    expect(validate('00:0', info).issues?.length).toBe(1);
    expect(validate('000:00', info).issues?.length).toBe(1);
    expect(validate('00:000', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISO time!';
    const validate = isoTime(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
