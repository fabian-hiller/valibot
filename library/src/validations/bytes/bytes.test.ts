import { describe, expect, test } from 'vitest';
import { bytes } from './bytes.ts';

describe('bytes', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid byte lengths', () => {
    const validate = bytes(3);
    const value1 = '123';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 'あ'; // in UTF-8, 'あ' is 3 bytes
    expect(validate(value2, info)).toEqual({ output: value2 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('12', info).issues?.length).toBe(1);
    expect(validate('1234', info).issues?.length).toBe(1);
    expect(validate('あいう', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is not "10"!';
    const validate = bytes(10, error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
