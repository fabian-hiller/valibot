import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullableAsync,
  nullish,
  nullishAsync,
  number,
  object,
  optional,
  optionalAsync,
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
    test('for undefined value', async () => {
      expect(getDefault(optional(string()))).toBeUndefined();
      expect(getDefault(optional(string(), undefined))).toBeUndefined();
      expect(getDefault(optional(string(), () => undefined))).toBeUndefined();
      expect(
        await getDefault(optionalAsync(string(), async () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(optional(string(), 'foo'))).toBe('foo');
      expect(getDefault(optionalAsync(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(optional(string(), () => 'foo'))).toBe('foo');
      expect(getDefault(optionalAsync(string(), () => 'foo'))).toBe('foo');
    });

    test('for asycn value getter', async () => {
      expect(await getDefault(optionalAsync(string(), async () => 'foo'))).toBe(
        'foo'
      );
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', async () => {
      expect(getDefault(nullable(string()))).toBeUndefined();
      expect(getDefault(nullable(string(), undefined))).toBeUndefined();
      expect(getDefault(nullable(string(), () => undefined))).toBeUndefined();
      expect(
        await getDefault(nullableAsync(string(), async () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(nullable(string(), 'foo'))).toBe('foo');
      expect(getDefault(nullableAsync(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(nullable(string(), () => 'foo'))).toBe('foo');
      expect(getDefault(nullableAsync(string(), () => 'foo'))).toBe('foo');
    });

    test('for value getter', async () => {
      expect(await getDefault(nullableAsync(string(), async () => 'foo'))).toBe(
        'foo'
      );
    });
  });

  describe('should return nullish default', () => {
    test('for undefined value', async () => {
      expect(getDefault(nullish(string()))).toBeUndefined();
      expect(getDefault(nullish(string(), undefined))).toBeUndefined();
      expect(getDefault(nullish(string(), () => undefined))).toBeUndefined();
      expect(
        await getDefault(nullishAsync(string(), async () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(nullish(string(), 'foo'))).toBe('foo');
      expect(getDefault(nullishAsync(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(nullish(string(), () => 'foo'))).toBe('foo');
      expect(getDefault(nullishAsync(string(), () => 'foo'))).toBe('foo');
    });

    test('for value getter', async () => {
      expect(await getDefault(nullishAsync(string(), async () => 'foo'))).toBe(
        'foo'
      );
    });
  });
});
