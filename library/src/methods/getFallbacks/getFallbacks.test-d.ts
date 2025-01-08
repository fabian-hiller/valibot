import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  number,
  object,
  strictObject,
  strictTuple,
  string,
  tuple,
} from '../../schemas/index.ts';
import { fallback } from '../fallback/index.ts';
import { getFallbacks } from './getFallbacks.ts';

describe('getFallbacks', () => {
  test('should return undefined', () => {
    expectTypeOf(getFallbacks(string())).toEqualTypeOf<undefined>();
    expectTypeOf(getFallbacks(number())).toEqualTypeOf<undefined>();
    expectTypeOf(getFallbacks(boolean())).toEqualTypeOf<undefined>();
  });

  test('should return default', () => {
    expectTypeOf(
      getFallbacks(fallback(string(), 'foo' as const))
    ).toEqualTypeOf<'foo'>();
    expectTypeOf(
      getFallbacks(fallback(number(), () => 123 as const))
    ).toEqualTypeOf<123>();
    expectTypeOf(
      getFallbacks(fallback(boolean(), false as const))
    ).toEqualTypeOf<false>();
  });

  describe('should return object defaults', () => {
    test('for empty object', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      expectTypeOf(getFallbacks(object({}))).toEqualTypeOf<{}>();
    });

    test('for simple object', () => {
      expectTypeOf(
        getFallbacks(
          object({
            key1: fallback(string(), 'foo' as const),
            key2: fallback(number(), () => 123 as const),
            key3: fallback(boolean(), false as const),
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
        getFallbacks(
          object({
            nested: strictObject({
              key1: fallback(string(), 'foo' as const),
              key2: fallback(number(), () => 123 as const),
              key3: fallback(boolean(), false as const),
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
      expectTypeOf(getFallbacks(tuple([]))).toEqualTypeOf<[]>();
    });

    test('for simple tuple', () => {
      expectTypeOf(
        getFallbacks(
          tuple([
            fallback(string(), 'foo' as const),
            fallback(number(), () => 123 as const),
            fallback(boolean(), false as const),
            string(),
          ])
        )
      ).toEqualTypeOf<['foo', 123, false, undefined]>();
    });

    test('for nested tuple', () => {
      expectTypeOf(
        getFallbacks(
          tuple([
            strictTuple([
              fallback(string(), 'foo' as const),
              fallback(number(), () => 123 as const),
              fallback(boolean(), false as const),
            ]),
            string(),
          ])
        )
      ).toEqualTypeOf<[['foo', 123, false], undefined]>();
    });
  });
});
