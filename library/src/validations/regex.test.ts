import { describe, expect, test } from 'vitest';
import { regex } from './regex';

describe('regex', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid strings', () => {
    const validate = regex(/^ID-\d{3}$/);
    expect(validate('ID-000', info)).toBe('ID-000');
    expect(validate('ID-123', info)).toBe('ID-123');
    expect(() => validate('123', info)).toThrowError();
    expect(() => validate('ID-1234', info)).toThrowError();
    expect(() => validate('id-123', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value does not match the regex!';
    const validate = regex(/^ID-\d{3}$/, error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
