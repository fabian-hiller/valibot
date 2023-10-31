import { describe, expect, test } from 'vitest';
import { object, optional, string, tuple } from '../../schemas/index.ts';
import { getFallbacksAsync } from './getFallbacksAsync.ts';
import { fallback } from '../fallback/index.ts';

describe('getFallbacksAsync', () => {
  test('should return undefined', async () => {
    expect(await getFallbacksAsync(string())).toBeUndefined();
    expect(await getFallbacksAsync(optional(string()))).toBeUndefined();
  });

  test('should return fallback value', async () => {
    expect(await getFallbacksAsync(fallback(string(), 'test'))).toBe('test');
    expect(
      await getFallbacksAsync(
        fallback(object({ key: string() }), { key: 'test' })
      )
    ).toEqual({
      key: 'test',
    });
  });

  test('should return object fallbacks', async () => {
    expect(await getFallbacksAsync(object({}))).toEqual({});
    expect(
      await getFallbacksAsync(
        object({
          key1: string(),
          key2: fallback(string(), 'test'),
          nested: object({
            key1: string(),
            key2: fallback(string(), 'test'),
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

  test('should return tuple fallbacks', async () => {
    expect(
      await getFallbacksAsync(
        tuple([
          string(),
          fallback(string(), 'test'),
          tuple([string(), fallback(string(), 'test')]),
        ])
      )
    ).toEqual([undefined, 'test', [undefined, 'test']]);
  });
});
