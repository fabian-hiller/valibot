import { describe, expect, test } from 'vitest';
import { value } from './value.ts';

describe('value', () => {
  test('should pass only valid values', () => {
    const validate1 = value(3);
    expect(validate1._parse(3).output).toBe(3);
    expect(validate1._parse(2).issues).toBeTruthy();
    expect(validate1._parse(2).issues).toBeTruthy();
    expect(validate1._parse(4).issues).toBeTruthy();

    const validate2 = value('test');
    expect(validate2._parse('test').output).toBe('test');
    expect(validate2._parse('tes').issues).toBeTruthy();
    expect(validate2._parse('testx').issues).toBeTruthy();

    const validate3 = value(new Date('2024-01-01'));
    const date = new Date('2024-01-01');
    expect(validate3._parse(date).output).toBe(date);
    expect(validate3._parse(new Date('2023-01-01')).issues).toBeTruthy();
    expect(validate3._parse(new Date(0)).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not "10"!';
    const validate = value(10, error);
    expect(validate._parse(123).issues?.[0].context.message).toBe(error);
  });
});
