import { describe, expect, test } from 'vitest';
import { isStrictlyJSONCompatible } from './isStrictlyJSONCompatible.ts';

describe(isStrictlyJSONCompatible, () => {
  test('should validate', () => {
    expect(isStrictlyJSONCompatible(null)).toBe(true);
    expect(isStrictlyJSONCompatible(true)).toBe(true);
    expect(isStrictlyJSONCompatible({ property: 'value' })).toBe(true);
  });

  test('should invalidate', () => {
    expect(isStrictlyJSONCompatible({ [Symbol()]: 'value' })).toBe(false);
    expect(isStrictlyJSONCompatible(1n)).toBe(false);
    expect(isStrictlyJSONCompatible(undefined)).toBe(false);
    expect(isStrictlyJSONCompatible(Infinity)).toBe(false);
    expect(isStrictlyJSONCompatible(NaN)).toBe(false);
    expect(isStrictlyJSONCompatible(new Date())).toBe(false);
    expect(isStrictlyJSONCompatible(Symbol())).toBe(false);

    class ObjectClass {
      field: string;
      constructor() {
        this.field = 'value';
      }
    }
    expect(isStrictlyJSONCompatible(new ObjectClass())).toBe(false);
  });
});
