import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  nullable,
  nullableAsync,
  nullish,
  number,
  object,
  optional,
  strictObject,
  strictTuple,
  string,
  tuple,
} from '../../schemas/index.ts';
import { getDefaultsAsync } from './getDefaultsAsync.ts';

describe('getDefaultsAsync', () => {
  test('should return undefined', () => {
    expectTypeOf(getDefaultsAsync(string())).toEqualTypeOf<
      Promise<undefined>
    >();
    expectTypeOf(getDefaultsAsync(number())).toEqualTypeOf<
      Promise<undefined>
    >();
    expectTypeOf(getDefaultsAsync(boolean())).toEqualTypeOf<
      Promise<undefined>
    >();
  });

  test('should return default', () => {
    expectTypeOf(getDefaultsAsync(optional(string(), 'foo'))).toEqualTypeOf<
      Promise<'foo'>
    >();
    expectTypeOf(
      getDefaultsAsync(nullish(number(), () => 123 as const))
    ).toEqualTypeOf<Promise<123>>();
    expectTypeOf(
      getDefaultsAsync(nullableAsync(boolean(), async () => false as const))
    ).toEqualTypeOf<Promise<false>>();
  });

  describe('should return object defaults', () => {
    test('for empty object', () => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      expectTypeOf(getDefaultsAsync(object({}))).toEqualTypeOf<Promise<{}>>();
    });

    test('for simple object', () => {
      expectTypeOf(
        getDefaultsAsync(
          // TODO: Switch this to `objectAsync`
          object({
            key1: optional(string(), 'foo'),
            key2: nullish(number(), () => 123 as const),
            // TODO: Switch this to `nullableAsync`
            key3: nullable(boolean(), false),
            key4: string(),
          })
        )
      ).toEqualTypeOf<
        Promise<{
          key1: 'foo';
          key2: 123;
          key3: false;
          key4: undefined;
        }>
      >();
    });

    test('for nested object', () => {
      expectTypeOf(
        getDefaultsAsync(
          // TODO: Switch this to `objectAsync`
          object({
            // TODO: Switch this to `strictObjectAsync`
            nested: strictObject({
              key1: optional(string(), 'foo'),
              key2: nullish(number(), () => 123 as const),
              // TODO: Switch this to `nullableAsync`
              key3: nullable(boolean(), false),
            }),
            other: string(),
          })
        )
      ).toEqualTypeOf<
        Promise<{
          nested: {
            key1: 'foo';
            key2: 123;
            key3: false;
          };
          other: undefined;
        }>
      >();
    });
  });

  describe('should return tuple defaults', () => {
    test('for empty tuple', () => {
      expectTypeOf(getDefaultsAsync(tuple([]))).toEqualTypeOf<Promise<[]>>();
    });

    test('for simple tuple', () => {
      expectTypeOf(
        getDefaultsAsync(
          // TODO: Switch this to `tupleAsync`
          tuple([
            optional(string(), 'foo'),
            nullish(number(), () => 123 as const),
            // TODO: Switch this to `nullableAsync`
            nullable(boolean(), false),
            string(),
          ])
        )
      ).toEqualTypeOf<Promise<['foo', 123, false, undefined]>>();
    });

    test('for nested tuple', () => {
      expectTypeOf(
        getDefaultsAsync(
          // TODO: Switch this to `tupleAsync`
          tuple([
            // TODO: Switch this to `strictTupleAsync`
            strictTuple([
              optional(string(), 'foo'),
              nullish(number(), () => 123 as const),
              // TODO: Switch this to `nullableAsync`
              nullable(boolean(), false),
            ]),
            string(),
          ])
        )
      ).toEqualTypeOf<Promise<[['foo', 123, false], undefined]>>();
    });
  });
});
