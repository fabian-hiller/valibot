import { describe, expect, test } from 'vitest';
import { value } from './value.ts';

describe('value', () => {
  test('should pass only valid values', () => {
    const validate1 = value(3);

    const value1 = 3;
    expect(validate1._parse(value1).output).toBe(value1);
    expect(validate1._parse(2).issues).toBeTruthy();
    expect(validate1._parse(2).issues).toBeTruthy();
    expect(validate1._parse(4).issues).toBeTruthy();

    const validate2 = value('test');
    const value2 = 'test';
    expect(validate2._parse(value2).output).toBe(value2);
    expect(validate2._parse('tes').issues).toBeTruthy();
    expect(validate2._parse('testx').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not "10"!';
    const validate = value(10, error);
    expect(validate._parse(123).issues?.[0].message).toBe(error);
  });
});
