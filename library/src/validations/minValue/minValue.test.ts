import { describe, expect, test } from 'vitest';
import { minValue } from './minValue.ts';

describe('minValue', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid values', () => {
    const validate1 = minValue('2023');
    expect(validate1('2023', info)).toEqual({ output: '2023' });
    expect(validate1('2023-01-01', info)).toEqual({ output: '2023-01-01' });
    expect(validate1('ABCD', info)).toEqual({ output: 'ABCD' });
    expect(validate1('', info).issues?.length).toBe(1);
    expect(validate1('123', info).issues?.length).toBe(1);
    expect(validate1('2022', info).issues?.length).toBe(1);
    expect(validate1('2022-01-01', info).issues?.length).toBe(1);

    const validate2 = minValue(3);
    expect(validate2(3, info)).toEqual({ output: 3 });
    expect(validate2(12345, info)).toEqual({ output: 12345 });
    expect(validate2(-123, info).issues?.length).toBe(1);
    expect(validate2(0, info).issues?.length).toBe(1);
    expect(validate2(2, info).issues?.length).toBe(1);

    const validate3 = minValue(3n);
    expect(validate3(3n, info)).toEqual({ output: 3n });
    expect(validate3(12345n, info)).toEqual({ output: 12345n });
    expect(validate3(-123n, info).issues?.length).toBe(1);
    expect(validate3(0n, info).issues?.length).toBe(1);
    expect(validate3(2n, info).issues?.length).toBe(1);

    const validate4 = minValue(new Date(Date.now() - 60000));
    const date1 = new Date();
    expect(validate4(date1, info)).toEqual({ output: date1 });
    const date2 = new Date(Date.now() + 10000);
    expect(validate4(date2, info)).toEqual({ output: date2 });
    const date3 = new Date(Date.now() - 10000);
    expect(validate4(date3, info)).toEqual({ output: date3 });
    expect(validate4(new Date(Date.now() - 120000), info).issues?.length).toBe(
      1
    );
    expect(validate4(new Date(Date.now() - 3600000), info).issues?.length).toBe(
      1
    );
  });

  test('should return custom error message', () => {
    const error = 'Value value is less than "3"!';
    const validate = minValue(3, error);
    expect(validate(1, info).issues?.[0].message).toBe(error);
  });
});
