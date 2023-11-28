import { describe, expect, test } from 'vitest';
import { bytes } from './bytes.ts';

describe('bytes', () => {
  test('should pass only valid byte lengths', () => {
    const validate = bytes(3);

    const value1 = '123';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'あ'; // in UTF-8, 'あ' is 3 bytes
    expect(validate._parse(value2).output).toBe(value2);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('12').issues).toBeTruthy();
    expect(validate._parse('1234').issues).toBeTruthy();
    expect(validate._parse('あいう').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is not "10"!';
    const validate = bytes(10, error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
