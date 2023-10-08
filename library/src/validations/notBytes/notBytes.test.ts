import { describe, expect, test } from 'vitest';
import { notBytes } from './notBytes.ts';

describe('notBytes', () => {
  test('should pass only valid byte lengths', () => {
    const validate = notBytes(3);

    const value1 = '12';
    expect(validate(value1).output).toBe(value1);
    const value2 = '1234';
    expect(validate(value2).output).toBe(value2);

    expect(validate('123').issues).toBeTruthy();
    expect(validate('あ').issues).toBeTruthy(); // in UTF-8, 'あ' is 3 bytes
  });

  test('should return custom error message', () => {
    const error = 'Value byte length is "5"!';
    const validate = notBytes(5, error);
    expect(validate('12345').issues?.[0].message).toBe(error);
  });
});
