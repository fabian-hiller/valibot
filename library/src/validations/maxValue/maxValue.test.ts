import { describe, expect, test } from 'vitest';
import { maxValue } from './maxValue.ts';

describe('maxValue', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid values', () => {
    const validate1 = maxValue('2023');
    expect(validate1('', info)).toEqual({ output: '' });
    expect(validate1('0', info)).toEqual({ output: '0' });
    expect(validate1('2023', info)).toEqual({ output: '2023' });
    expect(validate1('2022-01-01', info)).toEqual({ output: '2022-01-01' });
    expect(validate1('2024', info).issues?.length).toBe(1);
    expect(validate1('2024-01-01', info).issues?.length).toBe(1);

    const validate2 = maxValue(3);
    expect(validate2(-3, info)).toEqual({ output: -3 });
    expect(validate2(0, info)).toEqual({ output: 0 });
    expect(validate2(3, info)).toEqual({ output: 3 });
    expect(validate2(4, info).issues?.length).toBe(1);
    expect(validate2(456, info).issues?.length).toBe(1);

    const validate3 = maxValue(3n);
    expect(validate3(-3n, info)).toEqual({ output: -3n });
    expect(validate3(0n, info)).toEqual({ output: 0n });
    expect(validate3(3n, info)).toEqual({ output: 3n });
    expect(validate3(4n, info).issues?.length).toBe(1);
    expect(validate3(456n, info).issues?.length).toBe(1);

    const validate4 = maxValue(new Date(Date.now() + 60000));
    const date1 = new Date();
    expect(validate4(date1, info)).toEqual({ output: date1 });
    const date2 = new Date(Date.now() + 10000);
    expect(validate4(date2, info)).toEqual({ output: date2 });
    const date3 = new Date(Date.now() - 10000);
    expect(validate4(date3, info)).toEqual({ output: date3 });
    expect(validate4(new Date(Date.now() + 120000), info).issues?.length).toBe(
      1
    );
    expect(validate4(new Date(Date.now() + 3600000), info).issues?.length).toBe(
      1
    );
  });

  test('should return custom error message', () => {
    const error = 'Value value is greater than "3"!';
    const validate = maxValue(3, error);
    expect(validate(4, info).issues?.[0].message).toBe(error);
  });
});
