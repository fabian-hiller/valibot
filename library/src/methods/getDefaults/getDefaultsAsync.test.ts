import { describe, expect, test } from 'vitest';
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
  test('should return undefined', async () => {
    expect(await getDefaultsAsync(string())).toBeUndefined();
    expect(await getDefaultsAsync(number())).toBeUndefined();
    expect(await getDefaultsAsync(boolean())).toBeUndefined();
  });

  test('should return default', async () => {
    expect(await getDefaultsAsync(optional(string(), 'foo'))).toBe('foo');
    expect(await getDefaultsAsync(nullish(number(), () => 123 as const))).toBe(
      123
    );
    expect(
      await getDefaultsAsync(
        nullableAsync(boolean(), async () => false as const)
      )
    ).toBe(false);
  });

  describe('should return object defaults', () => {
    test('for empty object', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      expect(await getDefaultsAsync(object({}))).toStrictEqual({});
    });

    test('for simple object', async () => {
      expect(
        await getDefaultsAsync(
          // TODO: Switch this to `objectAsync`
          object({
            key1: optional(string(), 'foo'),
            key2: nullish(number(), () => 123 as const),
            // TODO: Switch this to `nullableAsync`
            key3: nullable(boolean(), false),
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
        await getDefaultsAsync(
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
      expect(await getDefaultsAsync(tuple([]))).toStrictEqual([]);
    });

    test('for simple tuple', async () => {
      expect(
        await getDefaultsAsync(
          // TODO: Switch this to `tupleAsync`
          tuple([
            optional(string(), 'foo'),
            nullish(number(), () => 123 as const),
            // TODO: Switch this to `nullableAsync`
            nullable(boolean(), false),
            string(),
          ])
        )
      ).toStrictEqual(['foo', 123, false, undefined]);
    });

    test('for nested tuple', async () => {
      expect(
        await getDefaultsAsync(
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
      ).toStrictEqual([['foo', 123, false], undefined]);
    });
  });
});
