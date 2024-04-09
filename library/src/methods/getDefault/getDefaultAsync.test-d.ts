import { describe, expectTypeOf, test } from 'vitest';
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
  test('should return undefined', () => {
    expectTypeOf(getDefaultAsync(string())).toEqualTypeOf<Promise<undefined>>();
    expectTypeOf(getDefaultAsync(number())).toEqualTypeOf<Promise<undefined>>();
    expectTypeOf(getDefaultAsync(object({}))).toEqualTypeOf<
      Promise<undefined>
    >();
  });

  describe('should return optional default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefaultAsync(optional(string()))).toEqualTypeOf<
        Promise<undefined>
      >();
      expectTypeOf(
        getDefaultAsync(optional(string(), undefined))
      ).toEqualTypeOf<Promise<undefined>>();
      expectTypeOf(
        getDefaultAsync(optional(string(), () => undefined))
      ).toEqualTypeOf<Promise<undefined>>();
    });

    test('for direct value', () => {
      expectTypeOf(getDefaultAsync(optional(string(), 'foo'))).toEqualTypeOf<
        Promise<'foo'>
      >();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefaultAsync(optional(string(), () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefaultAsync(nullable(string()))).toEqualTypeOf<
        Promise<undefined>
      >();
      expectTypeOf(
        getDefaultAsync(nullable(string(), undefined))
      ).toEqualTypeOf<Promise<undefined>>();
      expectTypeOf(
        getDefaultAsync(nullable(string(), () => undefined))
      ).toEqualTypeOf<Promise<undefined>>();
    });

    test('for direct value', () => {
      expectTypeOf(getDefaultAsync(nullable(string(), 'foo'))).toEqualTypeOf<
        Promise<'foo'>
      >();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefaultAsync(nullable(string(), () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });
  });

  describe('should return nullish default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefaultAsync(nullish(string()))).toEqualTypeOf<
        Promise<undefined>
      >();
      expectTypeOf(getDefaultAsync(nullish(string(), undefined))).toEqualTypeOf<
        Promise<undefined>
      >();
      expectTypeOf(
        getDefaultAsync(nullish(string(), () => undefined))
      ).toEqualTypeOf<Promise<undefined>>();
    });

    test('for direct value', () => {
      expectTypeOf(getDefaultAsync(nullish(string(), 'foo'))).toEqualTypeOf<
        Promise<'foo'>
      >();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefaultAsync(nullish(string(), () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });
  });
});
