import { describe, expect, test } from 'vitest';
import {
  nullableAsync,
  nullishAsync,
  number,
  numberAsync,
  object,
  objectAsync,
  optional,
  optionalAsync,
  string,
  stringAsync,
  tuple,
  tupleAsync,
} from '../../schemas/index.ts';
import { getDefaultsAsync } from './getDefaultsAsync.ts';

describe('getDefaultsAsync', () => {
  test('should return undefined', async () => {
    expect(await getDefaultsAsync(stringAsync())).toBeUndefined();
    expect(
      await getDefaultsAsync(optionalAsync(stringAsync()))
    ).toBeUndefined();
    expect(
      await getDefaultsAsync(nullableAsync(stringAsync()))
    ).toBeUndefined();
    expect(await getDefaultsAsync(nullishAsync(stringAsync()))).toBeUndefined();
  });

  test('should return default value', async () => {
    expect(await getDefaultsAsync(optionalAsync(stringAsync(), ''))).toBe('');
    expect(await getDefaultsAsync(nullableAsync(stringAsync(), ''))).toBe('');
    expect(await getDefaultsAsync(nullishAsync(stringAsync(), ''))).toBe('');
    expect(await getDefaultsAsync(optionalAsync(numberAsync(), 0))).toBe(0);
    expect(await getDefaultsAsync(nullableAsync(numberAsync(), 0))).toBe(0);
    expect(await getDefaultsAsync(nullishAsync(numberAsync(), 0))).toBe(0);
    expect(await getDefaultsAsync(optionalAsync(stringAsync(), 'test'))).toBe(
      'test'
    );
    expect(await getDefaultsAsync(nullableAsync(stringAsync(), 'test'))).toBe(
      'test'
    );
    expect(await getDefaultsAsync(nullishAsync(stringAsync(), 'test'))).toBe(
      'test'
    );
  });

  test('should return object defaults', async () => {
    expect(await getDefaultsAsync(objectAsync({}))).toEqual({});
    expect(
      await getDefaultsAsync(
        objectAsync({
          key1: stringAsync(),
          key2: optionalAsync(stringAsync(), 'test'),
          key3: optionalAsync(numberAsync(), 0),
          nested: object({
            key1: string(),
            key2: optional(string(), 'test'),
            key3: optional(number(), 0),
          }),
        })
      )
    ).toEqual({
      key1: undefined,
      key2: 'test',
      key3: 0,
      nested: {
        key1: undefined,
        key2: 'test',
        key3: 0,
      },
    });
  });

  test('should return tuple defaults', async () => {
    expect(
      await getDefaultsAsync(
        tupleAsync([
          stringAsync(),
          optionalAsync(stringAsync(), 'test'),
          optionalAsync(numberAsync(), 0),
          tuple([string(), optional(string(), 'test'), optional(number(), 0)]),
        ])
      )
    ).toEqual([undefined, 'test', 0, [undefined, 'test', 0]]);
  });
});
