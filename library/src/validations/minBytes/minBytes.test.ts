import { describe, expect, test } from 'vitest';
import { minBytes } from './minBytes.ts';

describe('minBytes', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid byte lengths', () => {
    const validate = minBytes(4);

    const value1 = 'abcd';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 'abcde';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = 'あい'; // in UTF-8, 'あい' is 6 bytes
    expect(validate(value3, info)).toEqual({ output: value3 });

    expect(validate('12', info).issues?.length).toBe(1);
    expect(validate('あ', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is lesser than "3"!';
    const validate = minBytes(3, error);
    expect(validate('ab', info).issues?.[0].message).toBe(error);
  });
});
