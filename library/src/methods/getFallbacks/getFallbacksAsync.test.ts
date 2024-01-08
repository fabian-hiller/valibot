import { describe, expect, test } from 'vitest';
import {
  number,
  numberAsync,
  object,
  objectAsync,
  string,
  stringAsync,
  tuple,
  tupleAsync,
} from '../../schemas/index.ts';
import { fallback, fallbackAsync } from '../fallback/index.ts';
import { getFallbacksAsync } from './getFallbacksAsync.ts';

describe('getFallbacksAsync', () => {
  test('should return undefined', async () => {
    expect(await getFallbacksAsync(stringAsync())).toBeUndefined();
  });

  test('should return fallbackAsync value', async () => {
    expect(await getFallbacksAsync(fallbackAsync(stringAsync(), ''))).toBe('');
    expect(await getFallbacksAsync(fallbackAsync(numberAsync(), 0))).toBe(0);
    expect(await getFallbacksAsync(fallbackAsync(stringAsync(), 'test'))).toBe(
      'test'
    );
    expect(
      await getFallbacksAsync(
        fallbackAsync(objectAsync({ key: stringAsync() }), { key: 'test' })
      )
    ).toEqual({
      key: 'test',
    });
  });

  test('should return objectAsync fallbacks', async () => {
    expect(await getFallbacksAsync(objectAsync({}))).toEqual({});
    expect(
      await getFallbacksAsync(
        objectAsync({
          key1: stringAsync(),
          key2: fallbackAsync(stringAsync(), 'test'),
          key3: fallbackAsync(numberAsync(), 0),
          nested: object({
            key1: string(),
            key2: fallback(string(), 'test'),
            key3: fallback(number(), 0),
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

  test('should return tuple fallbacks', async () => {
    expect(
      await getFallbacksAsync(
        tupleAsync([
          stringAsync(),
          fallbackAsync(stringAsync(), 'test'),
          fallbackAsync(numberAsync(), 0),
          tuple([string(), fallback(string(), 'test'), fallback(number(), 0)]),
        ])
      )
    ).toEqual([undefined, 'test', 0, [undefined, 'test', 0]]);
  });
});
