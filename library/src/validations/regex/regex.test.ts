import { describe, expect, test } from 'vitest';
import { regex } from './regex.ts';

describe('regex', () => {
  test('should pass only valid strings', () => {
    const validate = regex(/^ID-\d{3}$/);
    expect(validate('ID-000').output).toBe('ID-000');
    expect(validate('ID-123').output).toBe('ID-123');
    expect(validate('123').issue).toBeTruthy();
    expect(validate('ID-1234').issue).toBeTruthy();
    expect(validate('id-123').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not match the regex!';
    const validate = regex(/^ID-\d{3}$/, error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
