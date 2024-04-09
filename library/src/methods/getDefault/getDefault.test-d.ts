import { describe, expectTypeOf, test } from 'vitest';
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
    expectTypeOf(getDefault(string())).toEqualTypeOf<undefined>();
    expectTypeOf(getDefault(number())).toEqualTypeOf<undefined>();
    expectTypeOf(getDefault(object({}))).toEqualTypeOf<undefined>();
  });

  describe('should return optional default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefault(optional(string()))).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(optional(string(), undefined))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(optional(string(), () => undefined))
      ).toEqualTypeOf<undefined>();
    });

    test('for direct value', () => {
      expectTypeOf(
        getDefault(optional(string(), 'foo'))
      ).toEqualTypeOf<'foo'>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefault(optional(string(), () => 'foo' as const))
      ).toEqualTypeOf<'foo'>();
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefault(nullable(string()))).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(nullable(string(), undefined))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(nullable(string(), () => undefined))
      ).toEqualTypeOf<undefined>();
    });

    test('for direct value', () => {
      expectTypeOf(
        getDefault(nullable(string(), 'foo'))
      ).toEqualTypeOf<'foo'>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefault(nullable(string(), () => 'foo' as const))
      ).toEqualTypeOf<'foo'>();
    });
  });

  describe('should return nullish default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefault(nullish(string()))).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(nullish(string(), undefined))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(nullish(string(), () => undefined))
      ).toEqualTypeOf<undefined>();
    });

    test('for direct value', () => {
      expectTypeOf(getDefault(nullish(string(), 'foo'))).toEqualTypeOf<'foo'>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefault(nullish(string(), () => 'foo' as const))
      ).toEqualTypeOf<'foo'>();
    });
  });
});
