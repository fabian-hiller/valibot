import { describe, expect, test } from 'vitest';
import { maxBytes } from './maxBytes.ts';

describe('maxBytes', () => {
  test('should pass only valid byte lengths', () => {
    const validate = maxBytes(3);

    const value1 = '';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'abc';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 'あ'; // in UTF-8, 'あ' is 3 bytes
    expect(validate._parse(value3).output).toBe(value3);

    expect(validate._parse('1234').issues).toBeTruthy();
    expect(validate._parse('あいう').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is greater than "3"!';
    const validate = maxBytes(3, error);
    expect(validate._parse('あいう').issues?.[0].message).toBe(error);
  });
});
