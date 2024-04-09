import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
} from '../../schemas/index.ts';
import { getDefaultAsync } from './getDefaultAsync.ts';

describe('getDefaultAsync', () => {
  test('should return undefined', async () => {
    expect(await getDefaultAsync(string())).toBeUndefined();
    expect(await getDefaultAsync(number())).toBeUndefined();
    expect(await getDefaultAsync(object({}))).toBeUndefined();
  });

  describe('should return optional default', () => {
    test('for undefined value', async () => {
      expect(await getDefaultAsync(optional(string()))).toBeUndefined();
      expect(
        await getDefaultAsync(optional(string(), undefined))
      ).toBeUndefined();
      expect(
        await getDefaultAsync(optional(string(), () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', async () => {
      expect(await getDefaultAsync(optional(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', async () => {
      expect(await getDefaultAsync(optional(string(), () => 'foo'))).toBe(
        'foo'
      );
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', async () => {
      expect(await getDefaultAsync(nullable(string()))).toBeUndefined();
      expect(
        await getDefaultAsync(nullable(string(), undefined))
      ).toBeUndefined();
      expect(
        await getDefaultAsync(nullable(string(), () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', async () => {
      expect(await getDefaultAsync(nullable(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', async () => {
      expect(await getDefaultAsync(nullable(string(), () => 'foo'))).toBe(
        'foo'
      );
    });
  });

  describe('should return nullish default', () => {
    test('for undefined value', async () => {
      expect(await getDefaultAsync(nullish(string()))).toBeUndefined();
      expect(
        await getDefaultAsync(nullish(string(), undefined))
      ).toBeUndefined();
      expect(
        await getDefaultAsync(nullish(string(), () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', async () => {
      expect(await getDefaultAsync(nullish(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', async () => {
      expect(await getDefaultAsync(nullish(string(), () => 'foo'))).toBe('foo');
    });
  });
});
