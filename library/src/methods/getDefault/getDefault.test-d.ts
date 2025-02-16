import { describe, expectTypeOf, test } from 'vitest';
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
    expectTypeOf(getDefault(string())).toEqualTypeOf<undefined>();
    expectTypeOf(getDefault(number())).toEqualTypeOf<undefined>();
    expectTypeOf(getDefault(object({}))).toEqualTypeOf<undefined>();
  });

  describe('should return exact optional default', () => {
    test('for undefined value', () => {
      expectTypeOf(
        getDefault(exactOptional(string()))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(exactOptional(string(), undefined))
      ).toEqualTypeOf<undefined>();
    });

    test('for direct value', () => {
      expectTypeOf(
        getDefault(exactOptional(string(), 'foo'))
      ).toEqualTypeOf<'foo'>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefault(exactOptional(string(), () => 'foo' as const))
      ).toEqualTypeOf<'foo'>();
    });

    test('for async value getter', () => {
      expectTypeOf(
        getDefault(exactOptionalAsync(string(), async () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });

    test('for schema with pipe', () => {
      expectTypeOf(
        getDefault(pipe(exactOptional(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(exactOptional(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(exactOptionalAsync(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
    });
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
      expectTypeOf(
        getDefault(optionalAsync(string(), async () => undefined))
      ).toEqualTypeOf<Promise<undefined>>();
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

    test('for async value getter', () => {
      expectTypeOf(
        getDefault(optionalAsync(string(), async () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });

    test('for schema with pipe', () => {
      expectTypeOf(
        getDefault(pipe(optional(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(optional(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(optionalAsync(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
    });
  });

  describe('should return nullable default', () => {
    test('for undefined value', () => {
      expectTypeOf(getDefault(nullable(string()))).toEqualTypeOf<undefined>();
    });

    test('for null value', () => {
      expectTypeOf(getDefault(nullable(string(), null))).toEqualTypeOf<null>();
      expectTypeOf(
        getDefault(nullable(string(), () => null))
      ).toEqualTypeOf<null>();
      expectTypeOf(
        getDefault(nullableAsync(string(), async () => null))
      ).toEqualTypeOf<Promise<null>>();
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

    test('for async value getter', () => {
      expectTypeOf(
        getDefault(nullableAsync(string(), async () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });

    test('for schema with pipe', () => {
      expectTypeOf(
        getDefault(pipe(nullable(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(nullable(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(nullableAsync(string(), 'foo')))
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
      expectTypeOf(
        getDefault(nullishAsync(string(), async () => undefined))
      ).toEqualTypeOf<Promise<undefined>>();
    });

    test('for null value', () => {
      expectTypeOf(getDefault(nullish(string(), null))).toEqualTypeOf<null>();
      expectTypeOf(
        getDefault(nullish(string(), () => null))
      ).toEqualTypeOf<null>();
      expectTypeOf(
        getDefault(nullishAsync(string(), async () => null))
      ).toEqualTypeOf<Promise<null>>();
    });

    test('for direct value', () => {
      expectTypeOf(getDefault(nullish(string(), 'foo'))).toEqualTypeOf<'foo'>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefault(nullish(string(), () => 'foo' as const))
      ).toEqualTypeOf<'foo'>();
    });

    test('for async value getter', () => {
      expectTypeOf(
        getDefault(nullishAsync(string(), async () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });

    test('for schema with pipe', () => {
      expectTypeOf(
        getDefault(pipe(nullish(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(nullish(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(nullishAsync(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
    });
  });

  describe('should return undefinedable default', () => {
    test('for undefined value', () => {
      expectTypeOf(
        getDefault(undefinedable(string()))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(undefinedable(string(), undefined))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(undefinedable(string(), () => undefined))
      ).toEqualTypeOf<undefined>();
      expectTypeOf(
        getDefault(undefinedableAsync(string(), async () => undefined))
      ).toEqualTypeOf<Promise<undefined>>();
    });

    test('for direct value', () => {
      expectTypeOf(
        getDefault(undefinedable(string(), 'foo'))
      ).toEqualTypeOf<'foo'>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getDefault(undefinedable(string(), () => 'foo' as const))
      ).toEqualTypeOf<'foo'>();
    });

    test('for async value getter', () => {
      expectTypeOf(
        getDefault(undefinedableAsync(string(), async () => 'foo' as const))
      ).toEqualTypeOf<Promise<'foo'>>();
    });

    test('for schema with pipe', () => {
      expectTypeOf(
        getDefault(pipe(undefinedable(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(undefinedable(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
      expectTypeOf(
        getDefault(pipeAsync(undefinedableAsync(string(), 'foo')))
      ).toEqualTypeOf<'foo'>();
    });
  });
});
