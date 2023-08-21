import { describe, expect, test } from 'vitest';
import { bytes } from './bytes.ts';

describe('bytes', () => {
  test('should pass only valid byte lengths', () => {
    const validate = bytes(3);
    const value1 = '123';
    expect(validate(value1).output).toBe(value1);
    const value2 = 'あ'; // in UTF-8, 'あ' is 3 bytes
    expect(validate(value2).output).toBe(value2);

    expect(validate('').issue).toBeTruthy();
    expect(validate('12').issue).toBeTruthy();
    expect(validate('1234').issue).toBeTruthy();
    expect(validate('あいう').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is not "10"!';
    const validate = bytes(10, error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
