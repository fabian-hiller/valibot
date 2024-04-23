import { describe, expect, test } from 'vitest';
import { _isAllowedObjectKey } from './_isAllowedObjectKey.ts';

describe('_isAllowedObjectKey', () => {
  test('should return true for allowed keys', () => {
    expect(_isAllowedObjectKey('foo')).toBe(true);
    expect(_isAllowedObjectKey('bar')).toBe(true);
    expect(_isAllowedObjectKey('123')).toBe(true);
  });

  test('should return false for disallowed keys', () => {
    expect(_isAllowedObjectKey('__proto__')).toBe(false);
    expect(_isAllowedObjectKey('prototype')).toBe(false);
    expect(_isAllowedObjectKey('constructor')).toBe(false);
  });
});
