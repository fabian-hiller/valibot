import { describe, expect, test } from 'vitest';
import { _isValidObjectKey } from './_isValidObjectKey.ts';

describe('_isValidObjectKey', () => {
  test('should return true for allowed keys', () => {
    const object = { foo: 1, bar: 2, 123: 3 };
    expect(_isValidObjectKey(object, 'foo')).toBe(true);
    expect(_isValidObjectKey(object, 'bar')).toBe(true);
    expect(_isValidObjectKey(object, '123')).toBe(true);
  });

  test('should return false for inherited keys', () => {
    const object = Object.create({ foo: 1, bar: 2, 123: 3 });
    expect(_isValidObjectKey(object, 'foo')).toBe(false);
    expect(_isValidObjectKey(object, 'bar')).toBe(false);
    expect(_isValidObjectKey(object, '123')).toBe(false);
  });

  test('should return false for disallowed keys', () => {
    const object = { __proto__: 1, prototype: 2, constructor: 3 };
    expect(_isValidObjectKey(object, '__proto__')).toBe(false);
    expect(_isValidObjectKey(object, 'prototype')).toBe(false);
    expect(_isValidObjectKey(object, 'constructor')).toBe(false);
  });
});
