import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
} from '../../schemas/index.ts';
import { getDefault } from './getDefault.ts';

describe('getDefault', () => {
  test('should return undefined', () => {
    expect(getDefault(string())).toBeUndefined();
    expect(getDefault(number())).toBeUndefined();
    expect(getDefault(object({}))).toBeUndefined();
  });

  describe('should return optional default', () => {
    test('for undefined value', () => {
      expect(getDefault(optional(string()))).toBeUndefined();
      expect(getDefault(optional(string(), undefined))).toBeUndefined();
      expect(getDefault(optional(string(), () => undefined))).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(optional(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(optional(string(), () => 'foo'))).toBe('foo');
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', () => {
      expect(getDefault(nullable(string()))).toBeUndefined();
      expect(getDefault(nullable(string(), undefined))).toBeUndefined();
      expect(getDefault(nullable(string(), () => undefined))).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(nullable(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(nullable(string(), () => 'foo'))).toBe('foo');
    });
  });

  describe('should return nullish default', () => {
    test('for undefined value', () => {
      expect(getDefault(nullish(string()))).toBeUndefined();
      expect(getDefault(nullish(string(), undefined))).toBeUndefined();
      expect(getDefault(nullish(string(), () => undefined))).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(nullish(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(nullish(string(), () => 'foo'))).toBe('foo');
    });
  });
});
