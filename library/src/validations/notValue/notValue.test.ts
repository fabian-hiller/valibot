import { describe, expect, test } from 'vitest';
import { notValue } from './notValue.ts';

describe('notValue', () => {
  test('should pass only valid values', () => {
    const validate1 = notValue(3);
    expect(validate1._parse(3).issues).toBeTruthy();
    expect(validate1._parse(4).output).toBe(4);
    expect(validate1._parse(2).output).toBe(2);

    const validate2 = notValue('test');
    expect(validate2._parse('test').issues).toBeTruthy();
    expect(validate2._parse('tes').output).toBe('tes');
    expect(validate2._parse('testx').output).toBe('testx');

    const validate3 = notValue(new Date('2024-01-01'));
    expect(validate3._parse(new Date('2024-01-01')).issues).toBeTruthy();
    const date1 = new Date('2023-01-01');
    expect(validate3._parse(date1).output).toBe(date1);
    const date2 = new Date(0);
    expect(validate3._parse(date2).output).toBe(date2);
  });

  test('should return custom error message', () => {
    const error = 'Value is "10"!';
    const validate = notValue(10, error);
    expect(validate._parse(10).issues?.[0].context.message).toBe(error);
  });
});
