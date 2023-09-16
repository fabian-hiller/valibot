import { describe, expect, test } from 'vitest';
import { minBytes } from './minBytes.ts';

describe('minBytes', () => {
  test('should pass only valid byte lengths', () => {
    const validate = minBytes(4);

    const value1 = 'abcd';
    expect(validate(value1).output).toBe(value1);
    const value2 = 'abcde';
    expect(validate(value2).output).toBe(value2);
    const value3 = 'あい'; // in UTF-8, 'あい' is 6 bytes
    expect(validate(value3).output).toBe(value3);

    expect(validate('12').issues).toBeTruthy();
    expect(validate('あ').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is lesser than "3"!';
    const validate = minBytes(3, error);
    expect(validate('ab').issues?.[0].message).toBe(error);
  });
});
