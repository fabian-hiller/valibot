import { describe, expect, test } from 'vitest';
import {
  nullableAsync,
  nullishAsync,
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
    expect(await getDefaultsAsync(optionalAsync(string()))).toBeUndefined();
    expect(await getDefaultsAsync(nullableAsync(string()))).toBeUndefined();
    expect(await getDefaultsAsync(nullishAsync(string()))).toBeUndefined();
  });

  test('should return default value', async () => {
    expect(await getDefaultsAsync(optionalAsync(string(), 'test'))).toBe(
      'test'
    );
    expect(await getDefaultsAsync(nullableAsync(string(), 'test'))).toBe(
      'test'
    );
    expect(await getDefaultsAsync(nullishAsync(string(), 'test'))).toBe('test');
  });

  test('should return object defaults', async () => {
    expect(await getDefaultsAsync(objectAsync({}))).toEqual({});
    expect(
      await getDefaultsAsync(
        objectAsync({
          key1: string(),
          key2: optionalAsync(string(), 'test'),
          nested: object({
            key1: string(),
            key2: optional(string(), 'test'),
          }),
        })
      )
    ).toEqual({
      key1: undefined,
      key2: 'test',
      nested: {
        key1: undefined,
        key2: 'test',
      },
    });
  });

  test('should return tuple defaults', async () => {
    expect(
      await getDefaultsAsync(
        tupleAsync([
          stringAsync(),
          optionalAsync(string(), 'test'),
          tuple([string(), optional(string(), 'test')]),
        ])
      )
    ).toEqual([undefined, 'test', [undefined, 'test']]);
  });
});
