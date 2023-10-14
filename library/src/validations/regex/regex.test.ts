import { describe, expect, test } from 'vitest';
import { regex } from './regex.ts';

describe('regex', () => {
  test('should pass only valid strings', () => {
    const validate = regex(/^ID-\d{3}$/);
    expect(validate._parse('ID-000').output).toBe('ID-000');
    expect(validate._parse('ID-123').output).toBe('ID-123');
    expect(validate._parse('123').issues).toBeTruthy();
    expect(validate._parse('ID-1234').issues).toBeTruthy();
    expect(validate._parse('id-123').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not match the regex!';
    const validate = regex(/^ID-\d{3}$/, error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
