import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { isOfType } from './isOfType.ts';

describe('isOfType', () => {
  test('should check string schema', () => {
    const schema = string();
    expect(isOfType('string', schema)).toBe(true);
    // @ts-expect-error
    expect(isOfType('number', schema)).toBe(false);
    // @ts-expect-error
    expect(isOfType('object', schema)).toBe(false);
  });

  test('should check number schema', () => {
    const schema = number();
    expect(isOfType('number', schema)).toBe(true);
    // @ts-expect-error
    expect(isOfType('string', schema)).toBe(false);
    // @ts-expect-error
    expect(isOfType('object', schema)).toBe(false);
  });

  test('should check object schema', () => {
    const schema = object({ key: string() });
    expect(isOfType('object', schema)).toBe(true);
    // @ts-expect-error
    expect(isOfType('string', schema)).toBe(false);
    // @ts-expect-error
    expect(isOfType('number', schema)).toBe(false);
  });
});
