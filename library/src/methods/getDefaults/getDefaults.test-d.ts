import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  nullable,
  nullish,
  number,
  object,
  optional,
  strictObject,
  strictTuple,
  string,
  tuple,
} from '../../schemas/index.ts';
import { getDefaults } from './getDefaults.ts';

describe('getDefaults', () => {
  test('should return undefined', () => {
    expectTypeOf(getDefaults(string())).toEqualTypeOf<undefined>();
    expectTypeOf(getDefaults(number())).toEqualTypeOf<undefined>();
    expectTypeOf(getDefaults(boolean())).toEqualTypeOf<undefined>();
  });

  test('should return default', () => {
    expectTypeOf(getDefaults(optional(string(), 'foo'))).toEqualTypeOf<'foo'>();
    expectTypeOf(
      getDefaults(nullish(number(), () => 123 as const))
    ).toEqualTypeOf<123>();
    expectTypeOf(
      getDefaults(nullable(boolean(), false))
    ).toEqualTypeOf<false>();
  });

  describe('should return object defaults', () => {
    test('for empty object', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      expectTypeOf(getDefaults(object({}))).toEqualTypeOf<{}>();
    });

    test('for simple object', () => {
      expectTypeOf(
        getDefaults(
          object({
            key1: optional(string(), 'foo'),
            key2: nullish(number(), () => 123 as const),
            key3: nullable(boolean(), false),
            key4: string(),
          })
        )
      ).toEqualTypeOf<{
        key1: 'foo';
        key2: 123;
        key3: false;
        key4: undefined;
      }>();
    });

    test('for nested object', () => {
      expectTypeOf(
        getDefaults(
          object({
            nested: strictObject({
              key1: optional(string(), 'foo'),
              key2: nullish(number(), () => 123 as const),
              key3: nullable(boolean(), false),
            }),
            other: string(),
          })
        )
      ).toEqualTypeOf<{
        nested: {
          key1: 'foo';
          key2: 123;
          key3: false;
        };
        other: undefined;
      }>();
    });
  });

  describe('should return tuple defaults', () => {
    test('for empty tuple', () => {
      expectTypeOf(getDefaults(tuple([]))).toEqualTypeOf<[]>();
    });

    test('for simple tuple', () => {
      expectTypeOf(
        getDefaults(
          tuple([
            optional(string(), 'foo'),
            nullish(number(), () => 123 as const),
            nullable(boolean(), false),
            string(),
          ])
        )
      ).toEqualTypeOf<['foo', 123, false, undefined]>();
    });

    test('for nested tuple', () => {
      expectTypeOf(
        getDefaults(
          tuple([
            strictTuple([
              optional(string(), 'foo'),
              nullish(number(), () => 123 as const),
              nullable(boolean(), false),
            ]),
            string(),
          ])
        )
      ).toEqualTypeOf<[['foo', 123, false], undefined]>();
    });
  });
});
