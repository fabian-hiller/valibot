import { describe, expect, test } from 'vitest';
import { regex } from './regex.ts';

describe('regex', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid strings', () => {
    const validate = regex(/^ID-\d{3}$/);
    expect(validate('ID-000', info)).toEqual({ output: 'ID-000' });
    expect(validate('ID-123', info)).toEqual({ output: 'ID-123' });
    expect(validate('123', info).issues?.length).toBe(1);
    expect(validate('ID-1234', info).issues?.length).toBe(1);
    expect(validate('id-123', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value does not match the regex!';
    const validate = regex(/^ID-\d{3}$/, error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
