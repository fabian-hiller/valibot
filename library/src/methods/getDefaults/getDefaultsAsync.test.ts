import { describe, expect, test } from 'vitest';
import {
  boolean,
  nullableAsync,
  nullish,
  number,
  object,
  objectAsync,
  optional,
  strictObjectAsync,
  strictTupleAsync,
  string,
  tuple,
  tupleAsync,
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
      expect(await getDefaultsAsync(object({}))).toStrictEqual({});
    });

    test('for simple object', async () => {
      expect(
        await getDefaultsAsync(
          objectAsync({
            key1: optional(string(), 'foo'),
            key2: nullish(number(), () => 123 as const),
            key3: nullableAsync(boolean(), false),
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
          objectAsync({
            nested: strictObjectAsync({
              key1: optional(string(), 'foo'),
              key2: nullish(number(), () => 123 as const),
              key3: nullableAsync(boolean(), false),
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
          tupleAsync([
            optional(string(), 'foo'),
            nullish(number(), () => 123 as const),
            nullableAsync(boolean(), false),
            string(),
          ])
        )
      ).toStrictEqual(['foo', 123, false, undefined]);
    });

    test('for nested tuple', async () => {
      expect(
        await getDefaultsAsync(
          tupleAsync([
            strictTupleAsync([
              optional(string(), 'foo'),
              nullish(number(), () => 123 as const),
              nullableAsync(boolean(), false),
            ]),
            string(),
          ])
        )
      ).toStrictEqual([['foo', 123, false], undefined]);
    });
  });
});
