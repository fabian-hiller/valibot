import { describe, expect, test } from 'vitest';
import {
  boolean,
  number,
  object,
  strictObject,
  strictTuple,
  string,
  tuple,
} from '../../schemas/index.ts';
import { fallback, fallbackAsync } from '../fallback/index.ts';
import { getFallbacksAsync } from './getFallbacksAsync.ts';

describe('await getFallbacksAsync', () => {
  test('should return undefined', async () => {
    expect(await getFallbacksAsync(string())).toBeUndefined();
    expect(await getFallbacksAsync(number())).toBeUndefined();
    expect(await getFallbacksAsync(boolean())).toBeUndefined();
  });

  test('should return default', async () => {
    expect(await getFallbacksAsync(fallback(string(), 'foo' as const))).toBe(
      'foo'
    );
    expect(
      await getFallbacksAsync(fallback(number(), () => 123 as const))
    ).toBe(123);
    expect(
      await getFallbacksAsync(
        fallbackAsync(boolean(), async () => false as const)
      )
    ).toBe(false);
  });

  describe('should return object defaults', () => {
    test('for empty object', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      expect(await getFallbacksAsync(object({}))).toStrictEqual({});
    });

    test('for simple object', async () => {
      expect(
        await getFallbacksAsync(
          // TODO: Switch this to `objectAsync`
          object({
            key1: fallback(string(), 'foo' as const),
            key2: fallback(number(), () => 123 as const),
            // TODO: Switch this to `fallbackAsync`
            key3: fallback(boolean(), false as const),
            key4: string(),
          })
        )
      ).toStrictEqual({
        key1: 'foo',
        key2: 123,
        key3: false,
        key4: undefined,
      });
    });

    test('for nested object', async () => {
      expect(
        await getFallbacksAsync(
          // TODO: Switch this to `objectAsync`
          object({
            // TODO: Switch this to `strictObjectAsync`
            nested: strictObject({
              key1: fallback(string(), 'foo' as const),
              key2: fallback(number(), () => 123 as const),
              // TODO: Switch this to `fallbackAsync`
              key3: fallback(boolean(), false as const),
            }),
            other: string(),
          })
        )
      ).toStrictEqual({
        nested: {
          key1: 'foo',
          key2: 123,
          key3: false,
        },
        other: undefined,
      });
    });
  });

  describe('should return tuple defaults', () => {
    test('for empty tuple', async () => {
      expect(await getFallbacksAsync(tuple([]))).toStrictEqual([]);
    });

    test('for simple tuple', async () => {
      expect(
        await getFallbacksAsync(
          // TODO: Switch this to `tupleAsync`
          tuple([
            fallback(string(), 'foo' as const),
            fallback(number(), () => 123 as const),
            // TODO: Switch this to `fallbackAsync`
            fallback(boolean(), false as const),
            string(),
          ])
        )
      ).toStrictEqual(['foo', 123, false, undefined]);
    });

    test('for nested tuple', async () => {
      expect(
        await getFallbacksAsync(
          // TODO: Switch this to `tupleAsync`
          tuple([
            // TODO: Switch this to `strictTupleAsync`
            strictTuple([
              fallback(string(), 'foo' as const),
              fallback(number(), () => 123 as const),
              // TODO: Switch this to `fallbackAsync`
              fallback(boolean(), false as const),
            ]),
            string(),
          ])
        )
      ).toStrictEqual([['foo', 123, false], undefined]);
    });
  });
});
