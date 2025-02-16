import { describe, expect, test } from 'vitest';
import {
  exactOptional,
  exactOptionalAsync,
  nullable,
  nullableAsync,
  nullish,
  nullishAsync,
  number,
  object,
  optional,
  optionalAsync,
  string,
  undefinedable,
  undefinedableAsync,
} from '../../schemas/index.ts';
import { pipe, pipeAsync } from '../pipe/index.ts';
import { getDefault } from './getDefault.ts';

describe('getDefault', () => {
  test('should return undefined', () => {
    expect(getDefault(string())).toBeUndefined();
    expect(getDefault(number())).toBeUndefined();
    expect(getDefault(object({}))).toBeUndefined();
  });

  describe('should return exact optional default', () => {
    test('for undefined value', async () => {
      expect(getDefault(exactOptional(string()))).toBeUndefined();
      expect(getDefault(exactOptional(string(), undefined))).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(exactOptional(string(), 'foo'))).toBe('foo');
      expect(getDefault(exactOptionalAsync(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(exactOptional(string(), () => 'foo'))).toBe('foo');
      expect(getDefault(exactOptionalAsync(string(), () => 'foo'))).toBe('foo');
    });

    test('for asycn value getter', async () => {
      expect(
        await getDefault(exactOptionalAsync(string(), async () => 'foo'))
      ).toBe('foo');
    });

    test('for schema with pipe', () => {
      expect(getDefault(pipe(exactOptional(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(exactOptional(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(exactOptionalAsync(string(), 'foo')))).toBe(
        'foo'
      );
    });
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

    test('for schema with pipe', () => {
      expect(getDefault(pipe(optional(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(optional(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(optionalAsync(string(), 'foo')))).toBe('foo');
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', async () => {
      expect(getDefault(nullable(string()))).toBeUndefined();
    });

    test('for null value', async () => {
      expect(getDefault(nullable(string(), null))).toBeNull();
      expect(getDefault(nullable(string(), () => null))).toBeNull();
      expect(
        await getDefault(nullableAsync(string(), async () => null))
      ).toBeNull();
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

    test('for schema with pipe', () => {
      expect(getDefault(pipe(nullable(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(nullable(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(nullableAsync(string(), 'foo')))).toBe('foo');
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

    test('for null value', async () => {
      expect(getDefault(nullish(string(), null))).toBeNull();
      expect(getDefault(nullish(string(), () => null))).toBeNull();
      expect(
        await getDefault(nullishAsync(string(), async () => null))
      ).toBeNull();
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

    test('for schema with pipe', () => {
      expect(getDefault(pipe(nullish(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(nullish(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(nullishAsync(string(), 'foo')))).toBe('foo');
    });
  });

  describe('should return undefinedable default', () => {
    test('for undefined value', async () => {
      expect(getDefault(undefinedable(string()))).toBeUndefined();
      expect(getDefault(undefinedable(string(), undefined))).toBeUndefined();
      expect(
        getDefault(undefinedable(string(), () => undefined))
      ).toBeUndefined();
      expect(
        await getDefault(undefinedableAsync(string(), async () => undefined))
      ).toBeUndefined();
    });

    test('for direct value', () => {
      expect(getDefault(undefinedable(string(), 'foo'))).toBe('foo');
      expect(getDefault(undefinedableAsync(string(), 'foo'))).toBe('foo');
    });

    test('for value getter', () => {
      expect(getDefault(undefinedable(string(), () => 'foo'))).toBe('foo');
      expect(getDefault(undefinedableAsync(string(), () => 'foo'))).toBe('foo');
    });

    test('for asycn value getter', async () => {
      expect(
        await getDefault(undefinedableAsync(string(), async () => 'foo'))
      ).toBe('foo');
    });

    test('for schema with pipe', () => {
      expect(getDefault(pipe(undefinedable(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(undefinedable(string(), 'foo')))).toBe('foo');
      expect(getDefault(pipeAsync(undefinedableAsync(string(), 'foo')))).toBe(
        'foo'
      );
    });
  });
});
